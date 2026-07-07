type FraudStatus = 'Safe' | 'Risky' | 'Mediam';

export interface Order {
    id: number;
    orderId: string;
    product: string;
    customerName: string;
    customerPhone: string;
    date: string;
    time: string;
    price: string;
    payment: string;
    fraudStatus: FraudStatus;
    fraudScore: number;
    status: string;
}

export interface TableColumn<T = unknown> {
    header: string;
    key: string;
    className?: string;
    // Using the generic type T
    render?: (item: T, index: number) => React.ReactNode;
}