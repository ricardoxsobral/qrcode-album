import { Link } from 'react-router-dom';
import CameraUpload from '../../components/CameraUpload';
import './styles.css';

export default function Home() {
  return (
    <main className="home">
      <div className="home__background-mark home__background-mark--left">
        ✦
      </div>

      <div className="home__background-mark home__background-mark--right">
        ✈
      </div>

      <section className="home__content">
        <header className="home__header">
          <span className="home__eyebrow">
            Passaporte de memórias
          </span>

          <h1 className="home__title">
            Nadine
            <span>40 anos</span>
          </h1>

          <div className="home__divider">
            <span />
            <strong>♥</strong>
            <span />
          </div>

          <p className="home__description">
            Registre essa jornada especial com uma foto e uma mensagem.
          </p>
        </header>

        <CameraUpload />

        <Link className="home__album-link" to="/album">
          <span>Ver passaporte de memórias</span>
          <strong>→</strong>
        </Link>
      </section>
    </main>
  );
}