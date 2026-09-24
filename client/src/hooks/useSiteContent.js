import { useCallback, useEffect, useState } from 'react';
import { api } from '../api';

export function useSiteContent() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(() => {
    setLoading(true);
    return api
      .get('/content')
      .then(({ data }) => {
        setContent(data);
        setError(null);
      })
      .catch(() => setError('No se pudo cargar la información del sitio.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { content, loading, error, reload };
}
