export interface Invoice {
  id: number;
  servicio: string;
  periodo: string;
  monto: number;
  estado: 'pendiente' | 'pagado';
}
