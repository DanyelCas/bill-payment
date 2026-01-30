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
    items: ReceiptItem[];
    totalAmount: number;
    paymentMethod: string;
}
