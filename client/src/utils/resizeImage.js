export function resizeImage(file, { maxWidth, maxHeight, quality = 0.85, format }) {
  const outputFormat = format || (file.type === 'image/png' ? 'image/png' : 'image/jpeg');

  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const scale = Math.min(1, maxWidth / img.width, maxHeight / img.height);
      const width = Math.round(img.width * scale);
      const height = Math.round(img.height * scale);

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error('No se pudo procesar la imagen'));
          const ext = outputFormat === 'image/png' ? 'png' : 'jpg';
          const name = file.name.replace(/\.[^.]+$/, '') + '.' + ext;
          resolve(new File([blob], name, { type: outputFormat }));
        },
        outputFormat,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('No se pudo leer la imagen'));
    };

    img.src = objectUrl;
  });
}
