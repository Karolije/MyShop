import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

type OrderItem = {
  productId: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
  };
};

type Order = {
  id: string;
  status: string;
  createdAt: string;
  items: OrderItem[];
};

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user?.id) {
        navigate("/login");
        return;
      }

      try {
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select("*")
          .eq("userId", user.id);

        if (ordersError) throw ordersError;

        if (!ordersData || ordersData.length === 0) {
          setOrders([]);
          setLoading(false);
          return;
        }

        const { data: itemsData, error: itemsError } = await supabase
          .from("order_items")
          .select("orderId, quantity, products(id, name, price)")
          .in("orderId", ordersData.map(order => order.id));

        if (itemsError) throw itemsError;

        const ordersWithItems = ordersData.map(order => ({
          ...order,
          items: itemsData
            ?.filter(item => item.orderId === order.id)
            .map(item => ({
              productId: item.products[0].id,
              quantity: item.quantity,
              product: item.products[0],
            })) || [],
        }));

        setOrders(ordersWithItems);
      } catch (err: any) {
        console.error("Błąd pobierania historii zamówień:", err);
        setError(err.message || "Nieznany błąd");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  if (loading) return <p>Ładowanie historii zamówień...</p>;
  if (error) return <p>{error}</p>;
  if (orders.length === 0) return <p>Nie masz jeszcze żadnych zamówień.</p>;

  return (
    <div>
      <h2>Historia zamówień</h2>
      <ul>
        {orders.map(order => (
          <li
            key={order.id}
            style={{
              marginBottom: "1rem",
              borderBottom: "1px solid #ccc",
              paddingBottom: "0.5rem",
            }}
          >
            <p><strong>ID zamówienia:</strong> {order.id}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Data:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            <p><strong>Produkty:</strong></p>
            <ul>
              {order.items.length > 0 ? (
                order.items.map(item => (
                  <li key={item.productId}>
                    {item.product.name} — ilość: {item.quantity} — cena: {item.product.price.toFixed(2)} zł
                  </li>
                ))
              ) : (
                <li>Brak produktów</li>
              )}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderHistory;
