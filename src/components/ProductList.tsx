import { useEffect, useState } from "react";
import type { Product } from "../types/Product";
import { useCart } from "../context/CartContext";
import Cart from "./Cart";
import OrderForm from "./OrderForm";

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
const { addToCart } = useCart()

  useEffect(() => {
    fetch("http://localhost:3000/products")
      .then(res => res.json())
      .then((data: Product[]) => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Ładowanie produktów...</p>;

  if (products.length === 0) return <p>Brak produktów.</p>;

  return (
    <>
    <ul>
    {products.map(p => (
      <li key={p.id}>
        <h3>{p.name}</h3>
        <p>{p.description}</p>
        <p>Cena: {p.price.toFixed(2)} zł</p>
        {p.imageUrl && <img src={p.imageUrl} alt={p.name} width={100} />}
        <button onClick={() => addToCart(p)}>Dodaj do koszyka</button>
      </li>
    ))}
  </ul>  
  <Cart/> 
  <OrderForm/>
   </>

  );
};

export default ProductList;
