import { apiFetch } from './client';

export interface ApiUser {
  id: string;
  email: string;
  nombre: string;
  rol: 'CLIENTE' | 'ADMIN' | 'RECEPCIONISTA' | 'MESERO';
}

interface AuthResponse {
  token: string;
  user: ApiUser;
}

export const login = (email: string, password: string) =>
  apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const register = (nombre: string, email: string, password: string) =>
  apiFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ nombre, email, password }),
  });
