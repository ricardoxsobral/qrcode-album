import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { supabase } from '../../services/supabase';

export default function CameraUpload() {
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

  async function handleUpload() {
    if (!file) {
      return;
    }

    setUploading(true);
    setSuccess(false);
    setErrorMessage('');

    const extension = file.name.split('.').pop() || 'jpg';
    const fileName = `${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from('photos')
      .upload(fileName, file);

    if (uploadError) {
      setErrorMessage(uploadError.message);
      setUploading(false);
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
      setUploading(false);
      return;
    }

    setFile(null);
    setPreview('');
    setName('');
    setMessage('');
    setSuccess(true);
    setUploading(false);
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
      />

      {preview && (
        <div>
          <img src={preview} alt="Preview" width="300" />
        </div>
      )}

      <input
        type="text"
        placeholder="Seu nome"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />

      <textarea
        placeholder="Deixe uma mensagem"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
      />

      <button
        type="button"
        onClick={handleUpload}
        disabled={!file || uploading}
      >
        {uploading ? 'Enviando...' : 'Enviar foto'}
      </button>

      {success && <p>Foto enviada com sucesso ❤️</p>}

      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
}