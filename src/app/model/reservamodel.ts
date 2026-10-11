export interface Reserva{
    id :number;
    userId : string;
    userName : string;
    email : string;
    idAlojamiento : number;
    fechaLlegada: string;
    fechaSalida: string;
    numeroHuespedes: number;
    numeroNoches: number;
    precioTotal: number;
    estado: string;
}