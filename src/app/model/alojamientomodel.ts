import {Coordenadas} from "./coordenadasmodel";

export type TipoAlojamiento = 'Apartamento' | 'Casa' | 'Cabaña';

export interface Alojamiento {
    id: number;
    nombre: string;
    descripcion: string;
    ciudad: string;
    ubicacion: string;
    coords?: Coordenadas;
    tipo: TipoAlojamiento;
    capacidad :number;
    habitaciones: number;
    camas: number;
    banos: number;
    precioNoche :number;
    tarifaLimpieza: number;
    calificacion: number;
    activo: boolean;
    imagenPrincipal: string;
    imagenes: string[];
    servicios: string[];
    reglas: string[];
}