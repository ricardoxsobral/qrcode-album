import type { Photo } from '../../types/photo';
import './styles.css';

interface PhotoCardProps {
  photo: Photo;
  onClick: () => void;
}

export default function PhotoCard({
  photo,
  onClick
}: PhotoCardProps) {
  return (
    <article className="photo-card">
      <button
        className="photo-card__button"
        type="button"
        onClick={onClick}
        aria-label="Abrir foto"
      >
        <div className="photo-card__image-wrapper">
          <img
            className="photo-card__image"
            src={photo.image_url}
            alt={photo.name || 'Foto da festa'}
            loading="lazy"
          />
        </div>
      </button>

      {(photo.name || photo.message) && (
        <div className="photo-card__content">
          {photo.name && (
            <strong className="photo-card__name">
              {photo.name}
            </strong>
          )}

          {photo.message && (
            <p className="photo-card__message">
              {photo.message}
            </p>
          )}
        </div>
      )}
    </article>
  );
}