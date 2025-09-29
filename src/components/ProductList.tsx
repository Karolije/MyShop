import { useEffect, useState } from "react";
import type { Product } from "../types/Product";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient"; 
import "./ProductList.css";

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*");

        if (error) throw error;

        setProducts(data ?? []);
      } catch (err) {
        console.error("Błąd pobierania produktów:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
    } else {
      addToCart(product);
    }
  };

  if (loading) return <p>Ładowanie produktów...</p>;
  if (products.length === 0) return <p>Brak produktów.</p>;

  return (
    <main className="main">
    <h1 className="shop-title">Witamy w naszym sklepie!</h1>
    <p className="shop-subtitle">Sprawdź nasze bestsellery i dodaj je do koszyka!</p>
  
    <div className="product-list">
      {products.map((p) => (
        <div className="product-card" key={p.id}>
          {p.imageUrl && (
            <img src={p.imageUrl} alt={p.name} className="product-image" />
          )}
          <h3 className="product-name">{p.name}</h3>
          <p className="product-description">{p.description}</p>
          <p className="product-price">{p.price.toFixed(2)} zł</p>
          <button
            className="add-to-cart-btn"
            onClick={() => handleAddToCart(p)}
          >
            Dodaj do koszyka
          </button>
        </div>
      ))}
    </div>
  </main>
  
  );
};

export default ProductList;
