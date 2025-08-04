import { useEffect, useState } from "react";
import type { Order } from "../types/Order";

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("Musisz być zalogowany, aby zobaczyć historię zamówień.");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:3000/orders?userId=${userId}`)
      .then(res => {
        if (!res.ok) throw new Error("Błąd podczas pobierania historii zamówień");
        return res.json();
      })
      .then((data: Order[]) => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Ładowanie historii zamówień...</p>;
  if (error) return <p>{error}</p>;
  if (orders.length === 0) return <p>Nie masz jeszcze żadnych zamówień.</p>;

  return (
    <div>
      <h2>Historia zamówień</h2>
      <ul>
        {orders.map(order => (
          <li key={order.id} style={{ marginBottom: "1rem", borderBottom: "1px solid #ccc", paddingBottom: "0.5rem" }}>
            <p><strong>ID zamówienia:</strong> {order.id}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Data:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            <p><strong>Produkty:</strong></p>
            <ul>
            {Array.isArray(order.products) ? (
  order.products.map(({ productId, quantity }) => (
    <li key={productId}>
      Produkt ID: {productId}, ilość: {quantity}
    </li>
  ))
) : (
  <li>Brak danych o produktach</li>
)}

            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderHistory;
