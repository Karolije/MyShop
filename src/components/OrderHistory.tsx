import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

type Product = {
  id: number;
  name: string;
  price: number;
};

type OrderItem = {
  quantity: number;
  product: Product;
};

type Order = {
  id: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
};

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user?.id) {
      navigate("/MyShop/login");
      return;
    }

    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select(`
          id,
          status,
          createdAt,
          order_items (
            quantity,
            product:products (
              id,
              name,
              price
            )
          )
        `)
        .eq("userId", user.id)
        .order("createdAt", { ascending: false });

      if (ordersError) throw ordersError;

      const formattedOrders: Order[] = (ordersData || []).map(order => ({
        id: order.id,
        status: order.status,
        createdAt: order.createdAt,
        items: (order.order_items || []).map((item: any) => ({
          quantity: item.quantity,
          product: item.product,
        })),
      }));

      setOrders(formattedOrders);
    } catch (err: any) {
      console.error("Błąd pobierania historii zamówień:", err);
      setError(err.message || "Nieznany błąd");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId: number) => {
    const confirmDelete = window.confirm("Czy na pewno chcesz usunąć to zamówienie?");
    if (!confirmDelete) return;

    try {
      // Najpierw usuwamy powiązane produkty
      const { error: itemsError } = await supabase
        .from("order_items")
        .delete()
        .eq("orderId", orderId);
      if (itemsError) throw itemsError;

      // Następnie zamówienie
      const { error: orderError } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderId);
      if (orderError) throw orderError;

      // Odświeżamy listę
      setOrders(prev => prev.filter(o => o.id !== orderId));
      alert("Zamówienie zostało usunięte!");
    } catch (err: any) {
      console.error("Błąd usuwania zamówienia:", err);
      alert("Nie udało się usunąć zamówienia: " + (err.message || JSON.stringify(err)));
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

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
                order.items.map((item, index) => (
                  <li key={index}>
                    {item.product.name} — ilość: {item.quantity} — cena: {item.product.price.toFixed(2)} zł
                  </li>
                ))
              ) : (
                <li>Brak produktów</li>
              )}
            </ul>
            <button
              style={{
                backgroundColor: "#ff6b6b",
                color: "#fff",
                border: "none",
                padding: "0.4rem 0.8rem",
                borderRadius: "6px",
                cursor: "pointer",
                marginTop: "0.5rem",
              }}
              onClick={() => handleDeleteOrder(order.id)}
            >
              Usuń zamówienie
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderHistory;
