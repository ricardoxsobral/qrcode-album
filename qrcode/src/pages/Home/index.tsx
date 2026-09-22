import { Link } from 'react-router-dom';
import CameraUpload from '../../components/CameraUpload';
import './styles.css';

export default function Home() {
  return (
    <main className="home">
      <section className="home__content">
        <header className="home__header">
          <span className="home__eyebrow">Compartilhe esse momento</span>

          <h1 className="home__title">Aniversário</h1>

          <p className="home__description">
            Tire uma foto, deixe sua mensagem e faça parte desse álbum especial.
          </p>
        </header>

        <CameraUpload />

        <Link className="home__album-link" to="/album">
          Ver álbum da festa
        </Link>
      </section>
    </main>
  );
}