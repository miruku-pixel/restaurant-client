export type OrderStatus =
  | "PENDING"
  | "PREPARED"
  | "SERVED"
  | "PAID"
  | "CANCELLED";

export const ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "PREPARED",
  "SERVED",
  "PAID",
  "CANCELLED",
];

export interface OrderOption {
  id: string;
  name: string;
  quantity: number;
}

export interface OrderItem {
  id: string;
  foodName: string;
  quantity: number;
  options: OrderOption[];
}

export interface Order {
  id: string;
  status: string;
  remark?: string;
  tableNumber: string;
  waiterName: string;
  items: OrderItem[];
}
