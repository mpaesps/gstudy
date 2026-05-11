import axios, { type AxiosRequestConfig } from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333/api',
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('gstudy.token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export function setAuthSession(accessToken: string, user: unknown) {
  clearApiCache();
  localStorage.setItem('gstudy.token', accessToken);
  localStorage.setItem('gstudy.user', JSON.stringify(user));
}

export function clearAuthSession() {
  localStorage.removeItem('gstudy.token');
  localStorage.removeItem('gstudy.user');
  clearApiCache();
}

export function getStoredUser<T>() {
  if (typeof window === 'undefined') {
    return null;
  }

  const stored = localStorage.getItem('gstudy.user');
  return stored ? (JSON.parse(stored) as T) : null;
}

type CachedGetConfig = AxiosRequestConfig & {
  ttlMs?: number;
  cacheKey?: string;
};

type CachedPayload<T> = {
  expiresAt: number;
  data: T;
};

const cachePrefix = 'gstudy.cache.';

function stableStringify(value: unknown): string {
  if (!value || typeof value !== 'object') {
    return JSON.stringify(value ?? null);
  }

  if (Array.isArray(value)) {
    return JSON.stringify(value.map((item) => JSON.parse(stableStringify(item))));
  }

  return JSON.stringify(
    Object.keys(value as Record<string, unknown>)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = (value as Record<string, unknown>)[key];
        return acc;
      }, {}),
  );
}

function buildCacheKey(url: string, config?: AxiosRequestConfig) {
  return `${cachePrefix}${url}:${stableStringify(config?.params)}`;
}

export async function cachedGet<T>(url: string, config: CachedGetConfig = {}) {
  const { ttlMs = 60_000, cacheKey, ...axiosConfig } = config;
  const key = cacheKey ?? buildCacheKey(url, axiosConfig);

  if (typeof window !== 'undefined') {
    const stored = sessionStorage.getItem(key);
    if (stored) {
      const cached = JSON.parse(stored) as CachedPayload<T>;
      if (cached.expiresAt > Date.now()) {
        return cached.data;
      }
      sessionStorage.removeItem(key);
    }
  }

  const response = await api.get<T>(url, axiosConfig);

  if (typeof window !== 'undefined') {
    sessionStorage.setItem(key, JSON.stringify({ data: response.data, expiresAt: Date.now() + ttlMs }));
  }

  return response.data;
}

export function clearApiCache(prefix = cachePrefix) {
  if (typeof window === 'undefined') {
    return;
  }

  Object.keys(sessionStorage)
    .filter((key) => key.startsWith(prefix))
    .forEach((key) => sessionStorage.removeItem(key));
}
