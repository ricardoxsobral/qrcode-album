import { Link } from 'react-router-dom';
import CameraUpload from '../../components/CameraUpload';

export default function Home() {
  return (
    <main>
      <h1>Aniversário</h1>

      <p>Registre esse momento ❤️</p>

      <CameraUpload />

      <Link to="/album">Ver álbum</Link>
    </main>
  );
}