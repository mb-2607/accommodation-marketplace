export interface Cotizacion {
    alojamientoId: number;
    fechaLlegada: string;
    fechaSalida: string;
    numeroHuespedes: number;
    numeroNoches: number;
    precioNoche: number;
    subtotal: number;
    tarifaLimpieza: number;
    tarifaServicio: number;
    total: number;
}
export enum ErrorType {
    FECHA_INVALIDA = "FECHA_INVALIDA",
    CANTIDAD_HUESPEDES_MENOR_A_UNO = "CANTIDAD_HUESPEDES_MENOR_A_UNO",
    CANTIDAD_HUESPEDES_MAYOR_A_CAPACIDAD = "CANTIDAD_HUESPEDES_MAYOR_A_CAPACIDAD",
}

export interface CotizacionInvalida {
    errores: ErrorType[];
}
