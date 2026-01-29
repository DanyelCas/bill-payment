export interface Invoice {
  id: string;
  customerId: string;
  servicio: string;
  periodo: string;
  monto: number;
  estado: 'pendiente' | 'pagado' | 'vencido';
  fechaVencimiento?: string;
}
