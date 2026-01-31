export interface ReceiptItem {
    invoiceId: number;
    servicio: string;
    periodo: string;
    monto: number;
}

export interface Receipt {
    id: string;
    timestamp: string; // ISO String
    userId: string;
    customerName: string;
    items: ReceiptItem[];
    totalAmount: number;
    paymentMethod: string;
}
