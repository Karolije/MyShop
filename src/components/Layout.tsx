import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

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
    <div>
      <header style={{ background: "#eee", padding: "1rem" }}>
        <nav style={{ display: "flex", gap: "1rem" }}>
          <Link to="/products">Produkty</Link>

          {user ? (
            <>
              <Link to="/cart">Koszyk</Link>
              <Link to="/create-order">Zamówienie</Link>
              <Link to="/order-history">Historia zamówień</Link>
              <button onClick={handleLogout}>Wyloguj</button>
            </>
          ) : (
            <>
              <Link to="/login">Zaloguj się</Link>
              <Link to="/register">Rejestracja</Link>
            </>
          )}
        </nav>
      </header>

      <main style={{ padding: "2rem" }}>
        <Outlet context={{ setUser }} />
      </main>

      <footer style={{ textAlign: "center", padding: "1rem", background: "#eee" }}>
        &copy; {new Date().getFullYear()} Mój Sklep
      </footer>
    </div>
  );
};

export default Layout;
