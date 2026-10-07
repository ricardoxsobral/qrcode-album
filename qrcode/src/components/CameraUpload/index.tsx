import { useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { supabase } from '../../services/supabase';
import { compressImage } from '../../utils/compressImage';
import './styles.css';

export default function CameraUpload() {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setSuccess(false);
    setErrorMessage('');
  }

  function handleOpenCamera() {
    cameraInputRef.current?.click();
  }

  function handleOpenGallery() {
    galleryInputRef.current?.click();
  }

  function handleChangePhoto() {
    setFile(null);
    setPreview('');
    setSuccess(false);
    setErrorMessage('');

    if (cameraInputRef.current) {
      cameraInputRef.current.value = '';
    }

    if (galleryInputRef.current) {
      galleryInputRef.current.value = '';
    }
  }

  async function handleUpload() {
    if (!file) {
      return;
    }

    setUploading(true);
    setSuccess(false);
    setErrorMessage('');

    try {
      const compressedFile = await compressImage(file);

      const uniqueId =
        typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

      const fileName = `${uniqueId}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(fileName, compressedFile, {
          contentType: 'image/jpeg'
        });

      if (uploadError) {
        setErrorMessage(uploadError.message);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('photos')
        .getPublicUrl(fileName);

      const { error: insertError } = await supabase
        .from('photos')
        .insert({
          image_url: publicUrlData.publicUrl,
          storage_path: fileName,
          name: name || null,
          message: message || null
        });

      if (insertError) {
        setErrorMessage(insertError.message);
        return;
      }

      setFile(null);
      setPreview('');
      setName('');
      setMessage('');
      setSuccess(true);

      if (cameraInputRef.current) {
        cameraInputRef.current.value = '';
      }

      if (galleryInputRef.current) {
        galleryInputRef.current.value = '';
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Erro ao enviar a foto.'
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <section className="camera-upload">
      <div className="camera-upload__passport-header">
        <span>embarque confirmado</span>
        <strong>registro da jornada</strong>
      </div>

      <input
        ref={cameraInputRef}
        className="camera-upload__input-file"
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
      />

      <input
        ref={galleryInputRef}
        className="camera-upload__input-file"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />

      {!preview && (
        <div className="camera-upload__source-options">
          <button
            className="camera-upload__source-button"
            type="button"
            onClick={handleOpenCamera}
          >
            <span className="camera-upload__source-icon">
              📷
            </span>

            <strong>Abrir câmera</strong>

            <small>Tire uma foto agora</small>
          </button>

          <button
            className="camera-upload__source-button"
            type="button"
            onClick={handleOpenGallery}
          >
            <span className="camera-upload__source-icon">
              🖼️
            </span>

            <strong>Galeria</strong>

            <small>Escolha uma foto</small>
          </button>
        </div>
      )}

      {preview && (
        <div className="camera-upload__preview">
          <img
            className="camera-upload__preview-image"
            src={preview}
            alt="Prévia da foto"
          />

          <button
            className="camera-upload__change-photo"
            type="button"
            onClick={handleChangePhoto}
          >
            Trocar foto
          </button>
        </div>
      )}

      <div className="camera-upload__fields">
        <label className="camera-upload__field">
          <span>Passageiro</span>

          <input
            type="text"
            placeholder="Seu nome"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>

        <label className="camera-upload__field">
          <span>Mensagem da viagem</span>

          <textarea
            placeholder="Deixe uma mensagem para a Nadine..."
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
        </label>
      </div>

      <button
        className="camera-upload__submit"
        type="button"
        onClick={handleUpload}
        disabled={!file || uploading}
      >
        {uploading ? 'Registrando momento...' : 'Embarcar foto'}
      </button>

      {success && (
        <div className="camera-upload__feedback camera-upload__feedback--success">
          <strong>Embarque confirmado</strong>
          <span>Foto registrada no passaporte de memórias.</span>
        </div>
      )}

      {errorMessage && (
        <div className="camera-upload__feedback camera-upload__feedback--error">
          {errorMessage}
        </div>
      )}
    </section>
  );
}