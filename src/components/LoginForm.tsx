import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { hashPassword } from "../utils/hashPassword";
import "./LoginForm.css";

// -------------------------
// Typ wiersza w tabeli
// -------------------------
export type User = {
  id?: number; // id opcjonalne, Supabase generuje je automatycznie
  firstName: string;
  lastName: string;
  birthDate: string;
  login: string;
  email: string;
  passwordHash: string;
};

// -------------------------
// Typ dla LayoutContext
// -------------------------
type LayoutContext = {
  setUser: React.Dispatch<React.SetStateAction<string | null>>;
};

const LoginForm = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loggedUser, setLoggedUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Bezpieczne pobranie kontekstu
  const context = useOutletContext<LayoutContext>();
  if (!context) throw new Error("Outlet context not found");
  const { setUser } = context;

  // Sprawdzenie zalogowanego użytkownika przy mount
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const fetchUser = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", Number(userId))
          .single();

        if (error) throw error;

        if (data) {
          setLoggedUser(data);
          setUser(JSON.stringify(data));
        } else {
          localStorage.removeItem("userId");
          setUser(null);
        }
      } catch (err) {
        console.error("Błąd pobierania użytkownika:", err);
        localStorage.removeItem("userId");
        setUser(null);
      }
    };

    fetchUser();
  }, [setUser]);

  // Logowanie
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!login || !password) return;

    try {
      const passwordHash = await hashPassword(password);

      const { data: users, error } = await supabase
        .from("users")
        .select("*")
        .eq("login", login);

      if (error) {
        console.error("Błąd logowania:", error);
        alert("Błąd logowania");
        return;
      }

      if (!users || users.length === 0) {
        alert("Nie ma takiego użytkownika");
        return;
      }

      const user = users[0];
      if (user.passwordHash === passwordHash) {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("userId", String(user.id!));
        setLoggedUser(user);
        setUser(JSON.stringify(user));
        setLogin("");
        setPassword("");
        alert(`Zalogowano jako ${user.firstName}`);
        navigate("/");
      } else {
        alert("Błędne hasło");
      }
    } catch (err) {
      console.error("Błąd logowania:", err);
      alert("Nie udało się zalogować");
    }
  };

  // Wylogowanie
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    setLoggedUser(null);
    setUser(null);
  };

  // Jeśli użytkownik jest zalogowany
  if (loggedUser) {
    return (
      <div className="login-logged-in">
        <p>
          Zalogowano jako: {loggedUser.firstName} {loggedUser.lastName}
        </p>
        <button onClick={handleLogout}>Wyloguj</button>
      </div>
    );
  }

  // Formularz logowania
  return (
    <form onSubmit={handleSubmit} className="login-form">
      <input
        name="login"
        placeholder="Login"
        value={login}
        onChange={(e) => setLogin(e.target.value)}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Hasło"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Zaloguj</button>
    </form>
  );
};

export default LoginForm;
