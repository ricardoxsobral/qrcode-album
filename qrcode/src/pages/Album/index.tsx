import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import type { Photo } from '../../types/photo';
import PhotoCard from '../../components/PhotoCard';
import './styles.css';

export default function Album() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    async function loadPhotos() {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      setPhotos(data || []);
      setLoading(false);
    }

    loadPhotos();
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setSelectedPhoto(null);
      }
    }

    if (selectedPhoto) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedPhoto]);

  return (
    <main className="album">
      <div className="album__container">
        <header className="album__header">
          <Link className="album__back" to="/">
            ← Voltar
          </Link>

          <span className="album__eyebrow">Passaporte de memórias</span>

          <h1 className="album__title"> Momentos da jornada</h1>

          <p className="album__description">
            Cada foto é uma lembrança registrada nessa viagem especial dos 40 anos da Nadine. 
          </p>

          {!loading && !errorMessage && photos.length > 0 && (
            <span className="album__count">
              {photos.length} {photos.length === 1 ? 'foto' : 'fotos'}
            </span>
          )}
        </header>

        {loading && (
          <div className="album__status">
            <div className="album__loader" />
            <p>Carregando fotos...</p>
          </div>
        )}

        {errorMessage && (
          <div className="album__error">
            <strong>Não foi possível carregar o álbum.</strong>
            <p>{errorMessage}</p>
          </div>
        )}

        {!loading && !errorMessage && photos.length === 0 && (
          <div className="album__empty">
            <span>📷</span>

            <h2>O álbum ainda está vazio</h2>

            <p>Seja a primeira pessoa a registrar esse momento.</p>

            <Link to="/">Tirar uma foto</Link>
          </div>
        )}

        {!loading && !errorMessage && photos.length > 0 && (
          <section className="album__grid">
            {photos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                onClick={() => setSelectedPhoto(photo)}
              />
            ))}
          </section>
        )}

        {!loading && !errorMessage && photos.length > 0 && (
          <Link className="album__add-photo" to="/">
            ✈ Registrar momento
          </Link>
        )}
      </div>

      {selectedPhoto && (
        <div
          className="photo-modal"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            className="photo-modal__close"
            type="button"
            onClick={() => setSelectedPhoto(null)}
            aria-label="Fechar foto"
          >
            ×
          </button>

          <div
            className="photo-modal__content"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              className="photo-modal__image"
              src={selectedPhoto.image_url}
              alt={selectedPhoto.name || 'Foto da festa'}
            />

            {(selectedPhoto.name || selectedPhoto.message) && (
              <div className="photo-modal__info">
                {selectedPhoto.name && (
                  <strong>{selectedPhoto.name}</strong>
                )}

                {selectedPhoto.message && (
                  <p>{selectedPhoto.message}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}