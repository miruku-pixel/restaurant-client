import { useEffect, useState } from "react";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { FoodItem } from "../types/Food";
import { User } from "../types/User";
import { DiningTable } from "../types/DiningTable";

interface OrderEntryProps {
  user: User | null; // Receive the user prop
}

export default function OrderEntry({ user }: OrderEntryProps) {
  const [menu, setMenu] = useState<FoodItem[]>([]);
  const [tables, setTables] = useState<DiningTable[]>([]);
  const [selectedTableId, setSelectedTableId] = useState<string>("");
  const [orderRemark, setOrderRemark] = useState<string>("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    if (user?.entityId) {
      // Ensure user and entity are available
      fetchWithAuth(`/api/foods?entityId=${user.entityId}`)
        .then((res) => res.json())
        .then((foods) => {
          const formatted = foods.map((f: any) => ({
            id: f.id,
            name: f.name,
            price: f.price,
            selected: false,
            quantity: 1,
            options:
              f.options?.map((opt: any) => ({
                id: opt.id,
                name: opt.name,
                available: opt.available,
                extraPrice: opt.extraPrice,
                selected: false,
                quantity: 1,
              })) ?? [],
          }));
          setMenu(formatted);
        })
        .catch((err) => {
          console.error("Error:", err);
          alert("Failed to fetch menu. Please log in again.");
        });
    } else {
      // Handle the case where user or entity is not yet available (e.g., initial load)
      console.log("User or entity not yet available.");
      setMenu([]); // Or display a loading state
    }
  }, [user?.entityId]); // Re-fetch when the entity changes

  useEffect(() => {
    if (user?.entityId) {
      fetchWithAuth(`/api/tables?entityId=${user.entityId}`)
        .then((res) => res.json())
        .then((data) => setTables(data))
        .catch((err) => {
          console.error("Failed to fetch tables:", err);
          alert("Failed to fetch tables.");
        });
    }
  }, [user?.entityId]);

  const toggleOption = (foodId: string, optionId: string) => {
    setMenu((menu) =>
      menu.map((item) => {
        if (item.id === foodId && item.selected) {
          return {
            ...item,
            options: item.options?.map((opt) =>
              opt.id === optionId ? { ...opt, selected: !opt.selected } : opt
            ),
          };
        }
        return item;
      })
    );
  };

  const changeOptionQuantity = (
    foodId: string,
    optionId: string,
    delta: number
  ) => {
    setMenu((menu) =>
      menu.map((item) => {
        if (item.id === foodId && item.selected) {
          return {
            ...item,
            options: item.options?.map((opt) =>
              opt.id === optionId
                ? { ...opt, quantity: Math.max(1, opt.quantity + delta) }
                : opt
            ),
          };
        }
        return item;
      })
    );
  };

  const toggleSelect = (id: string) => {
    setMenu((menu) =>
      menu.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const changeQuantity = (id: string, delta: number) => {
    setMenu((menu) =>
      menu.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const totalPrice = menu.reduce((total, item) => {
    if (!item.selected) return total;

    const itemTotal = item.price * item.quantity;
    const optionsTotal = item.options
      .filter((opt) => opt.selected)
      .reduce((optSum, opt) => optSum + opt.extraPrice * opt.quantity, 0);

    return total + itemTotal + optionsTotal;
  }, 0);

  const submitOrder = async () => {
    if (!selectedTableId) {
      alert("Please select a table before submitting an order.");
      return;
    }

    const selectedItems = menu
      .filter((item) => item.selected)
      .map((item) => ({
        foodId: item.id,
        quantity: item.quantity,
        options: item.options
          .filter((opt) => opt.selected)
          .map((opt) => ({
            optionId: opt.id,
            quantity: opt.quantity,
          })),
      }));

    if (selectedItems.length === 0) {
      alert("Please select at least one menu item.");
      return;
    }

    const payload = {
      diningTableId: selectedTableId, // ✅ Matches backend
      waiterId: user?.id, // ✅ Matches backend
      entityId: user?.entityId, // ✅ Must supply this from context/auth
      items: selectedItems, // ✅ Assuming this follows expected structure
      remark: orderRemark,
    };

    try {
      const response = await fetchWithAuth("/api/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to submit order");
      }

      // ✅ Show success message
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);

      // ✅ Reset form state (adjust as needed)
      const resetMenu = menu.map((item) => ({
        ...item,
        selected: false,
        quantity: 1,
        options: item.options.map((opt) => ({
          ...opt,
          selected: false,
          quantity: 1,
        })),
      }));
      setMenu(resetMenu);
      setOrderRemark("");
      setSelectedTableId(null);
    } catch (err) {
      console.error(err);
      alert("Failed to submit order.");
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow h-[70vh] overflow-y-auto">
      {showSuccessMessage && (
        <div className="bg-green-100 text-green-800 text-sm rounded p-2 mt-4 transition-opacity duration-300">
          Order submitted successfully!
        </div>
      )}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Dining Table
        </label>
        <select
          className="border p-2 rounded w-40"
          value={selectedTableId}
          onChange={(e) => setSelectedTableId(e.target.value)}
        >
          <option value="">-- Select Table --</option>
          {tables.map((table) => (
            <option key={table.id} value={table.id}>
              Table #{table.number}
            </option>
          ))}
        </select>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
        Menu
      </h2>
      <div className="space-y-4">
        {menu.map((item) => (
          <div key={item.id} className="border-b pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={item.selected}
                  onChange={() => toggleSelect(item.id)}
                  className="w-5 h-5 text-blue-500"
                />
                <span>
                  {item.name}{" "}
                  <span className="text-sm text-gray-500 font-normal">
                    (Rp {item.price})
                  </span>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => changeQuantity(item.id, -1)}
                  className="bg-gray-300 px-2 rounded"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => changeQuantity(item.id, 1)}
                  className="bg-gray-300 px-2 rounded"
                >
                  +
                </button>
              </div>
            </div>

            {(item.options?.length ?? 0) > 0 && (
              <div className="ml-8 mt-2 space-y-1">
                {(item.options ?? []).map((opt) => (
                  <div
                    key={opt.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={opt.selected}
                        disabled={!item.selected} // Disable if food is not selected
                        onChange={() => toggleOption(item.id, opt.id)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{opt.name}</span>
                      {opt.extraPrice > 0 && (
                        <span className="text-sm text-gray-500">
                          (+{opt.extraPrice})
                        </span>
                      )}
                    </div>
                    {opt.selected && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            changeOptionQuantity(item.id, opt.id, -1)
                          }
                          className="bg-gray-200 px-2 rounded"
                        >
                          -
                        </button>
                        <span>{opt.quantity}</span>
                        <button
                          onClick={() =>
                            changeOptionQuantity(item.id, opt.id, 1)
                          }
                          className="bg-gray-200 px-2 rounded"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 bg-white border-t pt-4 mt-6 flex flex-col space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Order Remark
          </label>
          <textarea
            value={orderRemark}
            onChange={(e) => setOrderRemark(e.target.value)}
            placeholder="e.g. Chicken not too spicy"
            className="w-full p-2 border rounded-md mt-1"
            rows={3}
          />
        </div>
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold">
            Total:{" "}
            <span className="text-green-600">Rp {totalPrice.toFixed(0)}</span>
          </div>
          <button
            onClick={submitOrder}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Submit Order
          </button>
        </div>
      </div>
    </div>
  );
}
