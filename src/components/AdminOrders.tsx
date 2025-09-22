import { useEffect, useState } from "react";
import type { Order, OrderStatus } from "../types/Order";
import { supabase } from "../supabaseClient";

const ORDER_STATUSES: OrderStatus[] = [
  "nowe",
  "w realizacji",
  "zrealizowane",
  "wysłane",
  "zwrot",
  "odebrane",
];

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .order("createdAt", { ascending: false });

        if (error) throw error;
        setOrders(data ?? []);
      } catch (err: any) {
        console.error("Błąd pobierania zamówień:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", orderId);

      if (error) throw error;

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
    } catch (err) {
      console.error("Nie udało się zaktualizować statusu:", err);
      alert("Nie udało się zaktualizować statusu");
    }
  };

  if (loading) return <p>Ładowanie zamówień...</p>;
  if (error) return <p>Błąd: {error}</p>;
  if (orders.length === 0) return <p>Brak zamówień</p>;

  return (
    <div>
      <h1>Historia zamówień</h1>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Użytkownik</th>
            <th>Produkty</th>
            <th>Status</th>
            <th>Data</th>
            <th>Zmiana statusu</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.userId}</td>
              <td>
                <ul>
                  {Array.isArray(order.items) && order.items.length > 0 ? (
                    order.items.map(({ productId, quantity }) => (
                      <li key={productId}>
                        Produkt {productId} — ilość: {quantity}
                      </li>
                    ))
                  ) : (
                    <li>Brak produktów w zamówieniu</li>
                  )}
                </ul>
              </td>
              <td>{order.status}</td>
              <td>{new Date(order.createdAt).toLocaleString()}</td>
              <td>
                <select
                  value={order.status}
                  onChange={(e) =>
                    updateStatus(order.id, e.target.value as OrderStatus)
                  }
                >
                  {ORDER_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;
