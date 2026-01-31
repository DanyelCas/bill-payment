export interface Invoice {
  id: number;
  customerId?: string;
  servicio: string;
  mes: string;
  anio: number;
  monto: number;
  fechaVencimiento: string; // YYYY-MM-DD
  estado: 'pendiente' | 'pagado';
}
