import { useCart } from "../context/CartContext";

const Cart = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();

  if (cartItems.length === 0) return <p>Koszyk jest pusty.</p>;

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
    </div>
  );
};

export default Cart;
