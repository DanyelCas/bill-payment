export interface Invoice {
  id: number;
  customerId?: string;
  servicio: string;
  periodo: string;
  monto: number;
  fechaVencimiento: string; // YYYY-MM-DD
  estado: 'pendiente' | 'pagado';
}
