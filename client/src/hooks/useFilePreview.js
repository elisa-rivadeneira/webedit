import { useEffect, useState } from 'react';

export function useFilePreview(file, fallbackUrl) {
  const [url, setUrl] = useState(fallbackUrl || '');

  useEffect(() => {
    if (!file) {
      setUrl(fallbackUrl || '');
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file, fallbackUrl]);

  return url;
}
