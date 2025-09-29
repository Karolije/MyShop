import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Layout.css"; // import CSS

const Layout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const userFromStorage = localStorage.getItem("user");
    setUser(userFromStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    setUser(null);
    navigate("/");
  };

  return (
    <div className="container">
      <header className="header">
        <nav className="nav">
          <Link to="/products" className="nav-link">Produkty</Link>

          {user ? (
            <>
              <Link to="/cart" className="nav-link">Koszyk</Link>
              <Link to="/create-order" className="nav-link">Zamówienie</Link>
              <Link to="/order-history" className="nav-link">Historia zamówień</Link>
              <button className="button" onClick={handleLogout}>Wyloguj</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Zaloguj się</Link>
              <Link to="/register" className="nav-link">Rejestracja</Link>
            </>
          )}
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
