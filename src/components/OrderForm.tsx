import { useState } from "react";
import { useCart } from "../context/CartContext";
import type { Order, OrderItem } from "../types/Order";

const OrderForm = () => {
  const { cartItems, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleOrder = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Musisz się zalogować, aby złożyć zamówienie.");
      return;
    }
    if (cartItems.length === 0) {
      alert("Koszyk jest pusty.");
      return;
    }

    setLoading(true);

    const items: OrderItem[] = cartItems.map(({ product, quantity }) => ({
      productId: product.id,
      quantity,
    }));
    type NewOrder = Omit<Order, 'id'>;

    const order: NewOrder = {
        userId,
        products: items,
        createdAt: new Date().toISOString(),
        status: "w przygotowaniu",
      };
      

    try {
      const res = await fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });

      if (!res.ok) throw new Error("Błąd podczas składania zamówienia");

      alert("Zamówienie zostało złożone!");
      clearCart();
    } catch (err) {
      alert(`Coś poszło nie tak: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button disabled={loading} onClick={handleOrder}>
        {loading ? "Składam zamówienie..." : "Złóż zamówienie"}
      </button>
    </div>
  );
};

export default OrderForm;
