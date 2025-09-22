import { useCart } from "../context/CartContext";
import { useState } from "react";
import { supabase } from "../supabaseClient";

const CreateOrder = () => {
  const { cartItems, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleOrder = async () => {
    if (cartItems.length === 0) {
      alert("Koszyk jest pusty!");
      return;
    }

    const userId = Number(localStorage.getItem("userId"));
    if (!userId) {
      alert("Musisz się zalogować, aby złożyć zamówienie.");
      return;
    }

    setLoading(true);

    const order = {
      userId,
      status: "w przygotowaniu",
      createdAt: new Date().toISOString(),
    };

    try {
      const { data: newOrder, error: orderError } = await supabase
        .from("orders")
        .insert(order)
        .select()
        .single();

      if (orderError || !newOrder) throw new Error("Błąd przy tworzeniu zamówienia");

      const items = cartItems.map(({ product, quantity }) => ({
        orderId: newOrder.id,
        productId: product.id,
        quantity,
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(items);

      if (itemsError) throw new Error("Błąd przy dodawaniu produktów do zamówienia");

      alert("Zamówienie zostało utworzone!");
      clearCart();
    } catch (err: any) {
      alert(`Coś poszło nie tak: ${err.message}`);
    } finally {
      setLoading(false);
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
