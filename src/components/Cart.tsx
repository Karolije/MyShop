import { useCart } from "../context/CartContext";
import { supabase } from "../supabaseClient";
import "./Cart.css";

const Cart = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (cartItems.length === 0)
    return <p className="empty-cart">Koszyk jest pusty 🛒</p>;

  const handleOrder = async () => {
    if (!user?.id) {
      alert("Musisz być zalogowany, aby złożyć zamówienie.");
      return;
    }

    try {
      const { data: newOrderData, error: orderError } = await supabase
        .from("orders")
        .insert([{ userId: user.id, status: "w przygotowaniu" }])
        .select();

      if (orderError) throw orderError;
      if (!newOrderData || newOrderData.length === 0)
        throw new Error("Nie udało się utworzyć zamówienia");

      const newOrder = newOrderData[0];
      const itemsToInsert = cartItems.map((item) => ({
        orderId: newOrder.id,
        productId: item.product.id,
        quantity: item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      clearCart();
      alert("Zamówienie zostało złożone!");
    } catch (err: any) {
      console.error("Błąd składania zamówienia:", err);
      alert("Nie udało się złożyć zamówienia: " + (err.message || JSON.stringify(err)));
    }
  };

  return (
    <div className="cart-container">
      <h2>Koszyk</h2>
      <ul className="cart-list">
        {cartItems.map((item) => (
          <li className="cart-item" key={item.product.id}>
            {item.product.name} — ilość: {item.quantity}
            <button onClick={() => removeFromCart(item.product.id)}>Usuń</button>
          </li>
        ))}
      </ul>
      <div className="cart-actions">
        <button onClick={clearCart}>Wyczyść koszyk</button>
        <button onClick={handleOrder}>Zamów</button>
      </div>
    </div>
  );
};

export default Cart;
