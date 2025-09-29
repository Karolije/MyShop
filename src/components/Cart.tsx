import { useCart } from "../context/CartContext";
import { supabase } from "../supabaseClient";

const Cart = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  console.log("User z localStorage:", user);
  console.log("Cart items:", cartItems);

  if (cartItems.length === 0) return <p>Koszyk jest pusty.</p>;

  const handleOrder = async () => {
    if (!user?.id) {
      alert("Musisz być zalogowany, aby złożyć zamówienie.");
      return;
    }

    try {
      // Wstawiamy zamówienie
      const { data: newOrderData, error: orderError } = await supabase
      .from("orders")
      .insert([{ userId: user.id, status: "w przygotowaniu" }])
      .select();

      console.log("newOrderData:", newOrderData);
      console.log("orderError:", orderError);

      if (orderError) throw orderError;
      if (!newOrderData || newOrderData.length === 0) throw new Error("Nie udało się utworzyć zamówienia");

      const newOrder = newOrderData[0];

      // Przygotowujemy produkty do wstawienia
      const itemsToInsert = cartItems.map(item => ({
        orderId: newOrder.id,
        productId: item.product.id,
        quantity: item.quantity
      }));

      console.log("Items to insert:", itemsToInsert);

      const { data: itemsData, error: itemsError } = await supabase
        .from("order_items")
        .insert(itemsToInsert)
        .select();

      console.log("itemsData:", itemsData);
      console.log("itemsError:", itemsError);

      if (itemsError) throw itemsError;

      clearCart();
      alert("Zamówienie zostało złożone!");
    } catch (err: any) {
      console.error("Błąd składania zamówienia:", err);
      alert("Nie udało się złożyć zamówienia: " + (err.message || JSON.stringify(err)));
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
