import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Album from './pages/Album';
import AdminGallery from './pages/AdminGallery';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/album" element={<Album />} />
        <Route path="/admin-nadine-7k4p9x" element={<AdminGallery />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;