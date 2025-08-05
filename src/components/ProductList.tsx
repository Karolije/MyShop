import { useEffect, useState } from "react";
import type { Product } from "../types/Product";
import { useCart } from "../context/CartContext";
import Cart from "./Cart";
import OrderForm from "./OrderForm";
import "./ProductList.css";

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

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
      <div className="product-list">
        {products.map(p => (
          <div className="product-card" key={p.id}>
            {p.imageUrl && <img src={p.imageUrl} alt={p.name} className="product-image" />}
            <h3 className="product-name">{p.name}</h3>
            <p className="product-description">{p.description}</p>
            <p className="product-price">{p.price.toFixed(2)} zł</p>
            <button className="add-to-cart-btn" onClick={() => addToCart(p)}>
              Dodaj do koszyka
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductList;
