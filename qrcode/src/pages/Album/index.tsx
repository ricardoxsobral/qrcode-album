import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import type { Photo } from '../../types/photo';

export default function Album() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

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

  return (
    <main>
      <Link to="/">Voltar</Link>

      <h1>Álbum da festa</h1>

      {loading && <p>Carregando...</p>}

      {errorMessage && <p>{errorMessage}</p>}

      {!loading && photos.length === 0 && (
        <p>Nenhuma foto enviada ainda.</p>
      )}

      <section>
        {photos.map((photo) => (
          <article key={photo.id}>
            <img
              src={photo.image_url}
              alt={photo.name || 'Foto da festa'}
              width="300"
            />

            {photo.name && <strong>{photo.name}</strong>}

            {photo.message && <p>{photo.message}</p>}
          </article>
        ))}
      </section>
    </main>
  );
}