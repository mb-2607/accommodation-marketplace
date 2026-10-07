import {TipoAlojamiento} from "./alojamientomodel";

export interface FiltroAlojamiento {
    ciudad?: string;
    huespedes?: number;
    tipo?: TipoAlojamiento;
    precioMin?: number;
    precioMax?: number;
    servicios?: string[];
}