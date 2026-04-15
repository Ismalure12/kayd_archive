const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('kayd_token');
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  auth = false
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const json = await res.json();

  if (!json.success) {
    throw new ApiError(json.error || 'Something went wrong', res.status);
  }

  return json as T;
}

// Public endpoints
export const api = {
  stories: {
    list: (params?: Record<string, string | number>) =>
      request<any>(`/stories?${new URLSearchParams(params as any)}`),
    get: (slug: string) => request<any>(`/stories/${slug}`),
  },
  authors: {
    list: (params?: Record<string, string | number>) =>
      request<any>(`/authors?${new URLSearchParams(params as any)}`),
    get: (slug: string) => request<any>(`/authors/${slug}`),
  },
  tags: {
    list: () => request<any>('/tags'),
  },
  collections: {
    list: (params?: Record<string, string | number>) =>
      request<any>(`/collections?${new URLSearchParams(params as any)}`),
    get: (slug: string) => request<any>(`/collections/${slug}`),
  },
  search: {
    query: (q: string) => request<any>(`/search?q=${encodeURIComponent(q)}`),
  },
};

// Admin endpoints (require auth token)
export const adminApi = {
  auth: {
    login: (email: string, password: string) =>
      request<any>('/admin/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
  },
  dashboard: {
    stats: () => request<any>('/admin/dashboard/stats', {}, true),
  },
  authors: {
    list: (params?: Record<string, string | number>) =>
      request<any>(`/admin/authors?${new URLSearchParams(params as any)}`, {}, true),
    get: (id: string) => request<any>(`/admin/authors/${id}`, {}, true),
    create: (data: any) =>
      request<any>('/admin/authors', { method: 'POST', body: JSON.stringify(data) }, true),
    update: (id: string, data: any) =>
      request<any>(`/admin/authors/${id}`, { method: 'PUT', body: JSON.stringify(data) }, true),
    delete: (id: string) =>
      request<any>(`/admin/authors/${id}`, { method: 'DELETE' }, true),
  },
  stories: {
    list: (params?: Record<string, string | number>) =>
      request<any>(`/admin/stories?${new URLSearchParams(params as any)}`, {}, true),
    get: (id: string) => request<any>(`/admin/stories/${id}`, {}, true),
    create: (data: any) =>
      request<any>('/admin/stories', { method: 'POST', body: JSON.stringify(data) }, true),
    update: (id: string, data: any) =>
      request<any>(`/admin/stories/${id}`, { method: 'PUT', body: JSON.stringify(data) }, true),
    delete: (id: string) =>
      request<any>(`/admin/stories/${id}`, { method: 'DELETE' }, true),
  },
  tags: {
    list: (params?: Record<string, string | number>) =>
      request<any>(`/admin/tags?${new URLSearchParams(params as any)}`, {}, true),
    create: (data: any) =>
      request<any>('/admin/tags', { method: 'POST', body: JSON.stringify(data) }, true),
    update: (id: string, data: any) =>
      request<any>(`/admin/tags/${id}`, { method: 'PUT', body: JSON.stringify(data) }, true),
    delete: (id: string) =>
      request<any>(`/admin/tags/${id}`, { method: 'DELETE' }, true),
  },
  collections: {
    list: (params?: Record<string, string | number>) =>
      request<any>(`/admin/collections?${new URLSearchParams(params as any)}`, {}, true),
    get: (id: string) => request<any>(`/admin/collections/${id}`, {}, true),
    create: (data: any) =>
      request<any>('/admin/collections', { method: 'POST', body: JSON.stringify(data) }, true),
    update: (id: string, data: any) =>
      request<any>(`/admin/collections/${id}`, { method: 'PUT', body: JSON.stringify(data) }, true),
    delete: (id: string) =>
      request<any>(`/admin/collections/${id}`, { method: 'DELETE' }, true),
  },
};

export { ApiError, getToken };
