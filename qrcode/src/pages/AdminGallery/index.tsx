import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import type { Photo } from '../../types/photo';
import './styles.css';

export default function AdminGallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function fetchPhotos() {
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

    void fetchPhotos();
  }, []);

  async function handleDelete(photo: Photo) {
    const confirmed = window.confirm(
      'Tem certeza que deseja excluir essa foto?'
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(photo.id);
    setErrorMessage('');

    try {
      if (photo.storage_path) {
        const { error: storageError } = await supabase.storage
          .from('photos')
          .remove([photo.storage_path]);

        if (storageError) {
          throw storageError;
        }
      }

      const { error: databaseError } = await supabase
        .from('photos')
        .delete()
        .eq('id', photo.id);

      if (databaseError) {
        throw databaseError;
      }

      setPhotos((currentPhotos) =>
        currentPhotos.filter((item) => item.id !== photo.id)
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Erro ao excluir a foto.'
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="admin-gallery">
      <div className="admin-gallery__container">
        <header className="admin-gallery__header">
          <span className="admin-gallery__eyebrow">
            Área reservada
          </span>

          <h1>Gerenciar álbum</h1>

          <p>
            Aqui você pode remover fotos indesejadas do álbum.
          </p>

          <Link to="/album">
            Ver álbum
          </Link>
        </header>

        {loading && (
          <p className="admin-gallery__status">
            Carregando fotos...
          </p>
        )}

        {errorMessage && (
          <div className="admin-gallery__error">
            {errorMessage}
          </div>
        )}

        {!loading && photos.length === 0 && (
          <p className="admin-gallery__status">
            Nenhuma foto encontrada.
          </p>
        )}

        {!loading && photos.length > 0 && (
          <section className="admin-gallery__grid">
            {photos.map((photo) => (
              <article
                className="admin-gallery__card"
                key={photo.id}
              >
                <img
                  src={photo.image_url}
                  alt={photo.name || 'Foto da festa'}
                />

                <div className="admin-gallery__card-content">
                  {photo.name && (
                    <strong>{photo.name}</strong>
                  )}

                  {photo.message && (
                    <p>{photo.message}</p>
                  )}

                  <button
                    type="button"
                    disabled={deletingId === photo.id}
                    onClick={() => handleDelete(photo)}
                  >
                    {deletingId === photo.id
                      ? 'Excluindo...'
                      : 'Excluir foto'}
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}