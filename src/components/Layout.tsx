import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import "./Layout.css";

const Layout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<string | null>(null);
  const { cartItems } = useCart();

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const userFromStorage = localStorage.getItem("user");
    setUser(userFromStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    setUser(null);
    navigate("/"); // <- uwzględniamy base path
  };

  return (
    <div className="container">
      <header className="header">
        <nav className="nav">
          <div className="nav-left">
            <Link to="/products" className="nav-link">Produkty</Link>
            {user && <Link to="/order-history" className="nav-link">Historia zamówień</Link>}
          </div>

          <div className="nav-center">
            <Link to="/" className="store-name">☕ KUBKI Z DUSZĄ</Link>
          </div>

          <div className="nav-right">
            {user ? (
              <>
                <Link to="/cart" className="nav-link">
                  🛒 Koszyk {cartCount > 0 && <span className="cart-count">({cartCount})</span>}
                </Link>
                <button className="button" onClick={handleLogout}>👤 Wyloguj</button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">👤 Zaloguj się</Link>
                <Link to="/register" className="nav-link">Rejestracja</Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="main">
        <Outlet context={{ user, setUser }} />
      </main>

      <footer className="footer">
        &copy; {new Date().getFullYear()} Mój Sklep
      </footer>
    </div>
  );
};

export default Layout;
