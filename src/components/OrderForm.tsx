import { useState } from "react";
import { useCart } from "../context/CartContext";
import { supabase } from "../supabaseClient";

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

    try {
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          userId: Number(userId),
          status: "w przygotowaniu",
          createdAt: new Date().toISOString(),
        })
        .select()
        .single();

      if (orderError || !orderData) throw orderError;

      const orderId = orderData.id;

      const itemsToInsert = cartItems.map(({ product, quantity }) => ({
        orderId,
        productId: product.id,
        quantity,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      alert("Zamówienie zostało złożone!");
      clearCart();
    } catch (err: any) {
      alert(`Coś poszło nie tak: ${err.message || err}`);
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
