import { useCart } from "../context/CartContext";
import { supabase } from "../supabaseClient";

const Cart = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (cartItems.length === 0) return <p>Koszyk jest pusty.</p>;

  const handleOrder = async () => {
    if (!user?.id) {
      alert("Musisz być zalogowany, aby złożyć zamówienie.");
      return;
    }

    try {
      const { data: newOrder, error: orderError } = await supabase
        .from("orders")
        .insert([{ userId: user.id, status: "w przygotowaniu" }])
        .select()
        .single();

      if (orderError) throw orderError;

      const itemsToInsert = cartItems.map(item => ({
        orderId: newOrder.id,
        productId: item.product.id,
        quantity: item.quantity
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      clearCart();
      alert("Zamówienie zostało złożone!");
    } catch (err) {
      console.error("Błąd składania zamówienia:", err);
      alert("Nie udało się złożyć zamówienia.");
    }
  };

  return (
    <div>
      <h2>Koszyk</h2>
      <ul>
        {cartItems.map(item => (
          <li key={item.product.id}>
            {item.product.name} — ilość: {item.quantity}
            <button onClick={() => removeFromCart(item.product.id)}>Usuń</button>
          </li>
        ))}
      </ul>
      <button onClick={clearCart}>Wyczyść koszyk</button>
      <button onClick={handleOrder}>Zamów</button>
    </div>
  );
};

export default Cart;
