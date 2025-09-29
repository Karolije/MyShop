import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { User } from "../types/User";
import { supabase } from "../supabaseClient";
import { hashPassword } from "../utils/hashPassword";
import "./LoginForm.css"; 


type LayoutContext = {
  setUser: React.Dispatch<React.SetStateAction<string | null>>;
};

const LoginForm = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loggedUser, setLoggedUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { setUser } = useOutletContext<LayoutContext>();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const fetchUser = async () => {
      const { data, error } = await supabase
        .from<User>("users")
        .select("*")
        .eq("id", Number(userId)) 
        .single();

      if (data) {
        setLoggedUser(data);
        setUser(JSON.stringify(data));
      } else {
        localStorage.removeItem("userId");
        setUser(null);
      }
    };

    fetchUser();
  }, [setUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!login || !password) return;

    const passwordHash = await hashPassword(password);

    const { data: users, error } = await supabase
      .from<User>("users")
      .select("*")
      .eq("login", login); 

    if (error) {
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
      localStorage.setItem("userId", String(user.id));
      setLoggedUser(user);
      setUser(JSON.stringify(user));
      setLogin("");
      setPassword("");
      alert(`Zalogowano jako ${user.firstName}`);
      navigate("/");
    } else {
      alert("Błędne hasło");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    setLoggedUser(null);
    setUser(null);
  };

  if (loggedUser) {
    return (
      <div>
        <p>
          Zalogowano jako: {loggedUser.firstName} {loggedUser.lastName}
        </p>
        <button onClick={handleLogout}>Wyloguj</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
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
