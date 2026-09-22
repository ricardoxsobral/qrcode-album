import { useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { supabase } from '../../services/supabase';
import './styles.css';

export default function CameraUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    fileInputRef.current?.click();
  }

  async function handleUpload() {
  if (!file) {
    return;
  }

  setUploading(true);
  setSuccess(false);
  setErrorMessage('');

  try {
    const extension = file.name.split('.').pop() || 'jpg';

    const uniqueId =
      typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const fileName = `${uniqueId}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from('photos')
      .upload(fileName, file);

    if (uploadError) {
      setErrorMessage(uploadError.message);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from('photos')
      .getPublicUrl(fileName);

    const { error: insertError } = await supabase.from('photos').insert({
      image_url: publicUrlData.publicUrl,
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

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  } catch (error) {
    setErrorMessage(
      error instanceof Error ? error.message : 'Erro ao enviar a foto.'
    );
  } finally {
    setUploading(false);
  }
}

  return (
    <section className="camera-upload">
      <input
        ref={fileInputRef}
        className="camera-upload__input-file"
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
      />

      {!preview && (
        <button
          className="camera-upload__camera-button"
          type="button"
          onClick={handleOpenCamera}
        >
          <span className="camera-upload__camera-icon">📷</span>

          <span className="camera-upload__camera-content">
            <strong>Tirar uma foto</strong>
            <small>Abra a câmera do seu celular</small>
          </span>
        </button>
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
            onClick={handleOpenCamera}
          >
            Trocar foto
          </button>
        </div>
      )}

      <div className="camera-upload__fields">
        <label className="camera-upload__field">
          <span>Seu nome</span>

          <input
            type="text"
            placeholder="Como você se chama?"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>

        <label className="camera-upload__field">
          <span>Mensagem</span>

          <textarea
            placeholder="Escreva uma mensagem especial..."
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
        {uploading ? 'Enviando foto...' : 'Enviar foto'}
      </button>

      {success && (
        <div className="camera-upload__feedback camera-upload__feedback--success">
          Foto enviada com sucesso ❤️
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