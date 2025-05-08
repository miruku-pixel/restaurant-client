import React, { useState } from "react";
import { Order } from "../types/Order";

interface Props {
  orders: Order[];
}

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "PREPARED":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "SERVED":
      return "bg-green-100 text-green-800 border-green-300";
    case "PAID":
      return "bg-gray-100 text-gray-800 border-gray-300";
    case "CANCELLED":
      return "bg-red-100 text-red-800 border-red-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

const OrderStatus: React.FC<Props> = ({ orders }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="max-w-4xl mx-auto mt-6 space-y-4">
      {orders.map((order) => {
        const isExpanded = expandedId === order.id;

        return (
          <div key={order.id} className="border rounded shadow bg-white">
            {/* Summary Row */}
            <div
              className="flex items-center justify-between px-4 py-3 cursor-pointer"
              onClick={() => setExpandedId(isExpanded ? null : order.id)}
            >
              <div className="flex items-center space-x-2">
                <button className="text-xl font-bold transform transition duration-300">
                  {isExpanded ? "-" : "+"}
                </button>
                <span className="font-medium">
                  Table {order.tableNumber} – {order.waiterName}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <span
                  className={`text-sm font-semibold px-2 py-1 border rounded ${getStatusBadgeClass(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>

                <button className="text-blue-600 text-sm hover:underline">
                  Edit
                </button>
              </div>
            </div>

            {/* Expanded Detail */}
            {isExpanded && (
              <div className="border-t px-4 py-3">
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx}>
                      <p className="font-semibold">
                        {item.foodName} (x{item.quantity})
                      </p>
                      {item.options.length > 0 && (
                        <ul className="text-sm text-gray-600 list-disc pl-5">
                          {item.options.map((opt, i) => (
                            <li key={i}>
                              {opt.name} (x{opt.quantity})
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>

                {order.remark && (
                  <div className="mt-3 text-sm text-gray-700">
                    <span className="font-medium">Remark:</span> {order.remark}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OrderStatus;
