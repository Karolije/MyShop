import { useEffect, useState } from "react";
import type { Order, OrderStatus } from "../types/Order";

const ORDER_STATUSES: OrderStatus[] = [
  "w realizacji",
  "wysłane",
  "odebrane",
  "zwrot",
];

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000/orders")
      .then((res) => {
        if (!res.ok) throw new Error("Błąd pobierania zamówień");
        return res.json();
      })
      .then((data: Order[]) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const res = await fetch(`http://localhost:3000/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Błąd aktualizacji statusu");

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
    } catch (e) {
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
                  {Array.isArray(order.items) ? (
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
