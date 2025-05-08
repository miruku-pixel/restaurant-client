import { useEffect, useState } from "react";
import { Order } from "../types/Order";
import OrderStatus from "../components/OrderStatus";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { User } from "../types/User";

interface OrderStatusProps {
  user: User | null; // Receive the user prop
}

const mapOrderResponse = (raw: any): Order => {
  return {
    id: raw.id,
    status: raw.status,
    remark: raw.remark,
    tableNumber: raw.diningTable?.number?.toString() ?? "-",
    waiterName: raw.waiter?.username ?? "-",
    items: Array.isArray(raw.items)
      ? raw.items.map((item: any) => ({
          id: item.id,
          foodName: item.food?.name ?? "Unknown",
          quantity: item.quantity,
          options: Array.isArray(item.options)
            ? item.options.map((opt: any) => ({
                id: opt.id,
                name: opt.option?.name ?? "Option Name Not Found",
                quantity: opt.quantity,
              }))
            : [],
        }))
      : [],
  };
};

export default function StatusPage({ user }: OrderStatusProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.entityId) {
      const fetchOrders = async () => {
        try {
          const response = await fetchWithAuth(
            `/api/status?entityId=${user.entityId}`,
            {
              method: "GET",
            }
          );

          if (!response.ok) throw new Error("Failed to fetch");

          if (!response.ok && response.status !== 304) {
            throw new Error(`Failed to fetch with status: ${response.status}`);
          }

          if (response.status !== 304) {
            const rawData = await response.json();

            const mappedOrders = rawData.map(mapOrderResponse);
            setOrders(mappedOrders);
          }
        } catch (error) {
          console.error("Error fetching orders:", error);
          alert("Failed to load orders");
          setOrders([]);
        } finally {
          setLoading(false);
        }
      };

      fetchOrders();
    }
  }, [user?.entityId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Active Orders</h1>
      <OrderStatus orders={orders} />
    </div>
  );
}
