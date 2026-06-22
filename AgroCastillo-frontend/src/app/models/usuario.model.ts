import { Rol } from './rol.enum';

export interface Usuario {
  id?: number;
  nombre: string;
  email: string;
  rol: Rol;
  orcid?: string | null;
}