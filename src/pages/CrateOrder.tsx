import { useCart } from "../context/CartContext";
import { useState } from "react";

const CreateOrder = () => {
  const { cartItems, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleOrder = async () => {
    if (cartItems.length === 0) {
      alert("Koszyk jest pusty!");
      return;
    }

    setLoading(true);

    const order = {
      userId: Number(localStorage.getItem("userId")),
      items: cartItems.map(({ product, quantity }) => ({
        productId: product.id,
        quantity,
      })),
      status: "w przygotowaniu",
      createdAt: new Date().toISOString(),
    };

    const res = await fetch("http://localhost:3000/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });

    setLoading(false);

    if (res.ok) {
      alert("Zamówienie zostało utworzone!");
      clearCart();
    } else {
      alert("Coś poszło nie tak...");
    }
  };

  return (
    <div>
      <h2>Tworzenie zamówienia</h2>
      <button onClick={handleOrder} disabled={loading}>
        {loading ? "Tworzenie..." : "Zamów"}
      </button>
    </div>
  );
};

export default CreateOrder;
