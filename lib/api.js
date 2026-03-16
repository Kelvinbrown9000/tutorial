async function apiRequest(path, options = {}) {
  const url = path.startsWith('http') ? path : `/api${path}`;
  const res = await fetch(url, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  if (res.status === 401) {
    // Try refresh once
    const refresh = await fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' });
    if (refresh.ok) {
      const retry = await fetch(url, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
        ...options,
      });
      if (!retry.ok) {
        const err = await retry.json().catch(() => ({}));
        throw new Error(err.error || 'Request failed');
      }
      return retry.json();
    }
    throw new Error('Session expired. Please sign in again.');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Request failed with status ${res.status}`);
  }

  return res.json();
}

export const api = {
  get: (path) => apiRequest(path, { method: 'GET' }),
  post: (path, body) =>
    apiRequest(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: (path, body) =>
    apiRequest(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path) => apiRequest(path, { method: 'DELETE' }),
};

export default api;
