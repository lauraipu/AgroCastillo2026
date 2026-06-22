import { Rol } from './rol.enum';

export interface AuthResponse {
  token: string;
  rol: Rol;
  nombre: string;
  email: string;
  orcid?: string | null;
}