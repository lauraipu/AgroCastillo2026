import { Rol } from './rol.enum';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  email: string;
  password: string;
  rol: Rol;
  ocupacion?: string;
  orcid?: string | null;
  cvlac?: string | null;
}