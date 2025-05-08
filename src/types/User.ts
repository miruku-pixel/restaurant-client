export type UserRole = "WAITER" | "CHEF" | "CASHIER" | "ADMIN";

export interface User {
  id: string;
  username: string;
  role: UserRole;
  entityId: string | null;
  entity: string | null;
}
