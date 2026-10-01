export async function compressImage(file: File): Promise<File> {
  const imageBitmap = await createImageBitmap(file);

  const maxSize = 1800;
  const scale = Math.min(
    maxSize / imageBitmap.width,
    maxSize / imageBitmap.height,
    1
  );

  const width = Math.round(imageBitmap.width * scale);
  const height = Math.round(imageBitmap.height * scale);

  const canvas = document.createElement('canvas');

  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Não foi possível processar a imagem.');
  }

  context.drawImage(
    imageBitmap,
    0,
    0,
    width,
    height
  );

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (!result) {
          reject(
            new Error('Não foi possível comprimir a imagem.')
          );
          return;
        }

        resolve(result);
      },
      'image/jpeg',
      0.82
    );
  });

  const fileName = file.name.replace(/\.[^/.]+$/, '');

  return new File(
    [blob],
    `${fileName}.jpg`,
    {
      type: 'image/jpeg',
      lastModified: Date.now()
    }
  );
}