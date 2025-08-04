import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { User } from "../types/User";
import { hashPassword } from "../utils/hashPassword";

type LayoutContext = {
  setUser: React.Dispatch<React.SetStateAction<string | null>>;
};

const LoginForm = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loggedUser, setLoggedUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Pobierz setUser z Layout przez Outlet context
  const { setUser } = useOutletContext<LayoutContext>();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetch(`http://localhost:3000/users/${userId}`)
        .then(res => res.json())
        .then((user: User) => {
          setLoggedUser(user);
          setUser(localStorage.getItem("user")); // synchronizacja
        })
        .catch(() => {
          localStorage.removeItem("userId");
          setUser(null);
        });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const passwordHash = await hashPassword(password);

    const res = await fetch(`http://localhost:3000/users?login=${encodeURIComponent(login)}`);
    const users: User[] = await res.json();

    if (users.length === 0) {
      alert("Nie ma takiego użytkownika");
      return;
    }

    const user = users[0];
    if (user.passwordHash === passwordHash) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userId", String(user.id));
      setLoggedUser(user);
      setUser(JSON.stringify(user));  // <-- tutaj aktualizujesz stan w Layout
      setLogin("");
      setPassword("");
      alert(`Zalogowano jako ${user.firstName}`);
      navigate("/"); // przekierowanie po zalogowaniu
    } else {
      alert("Błędne hasło");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    setLoggedUser(null);
    setUser(null);  // synchronizacja z Layout
  };

  if (loggedUser) {
    return (
      <div>
        <p>Zalogowano jako: {loggedUser.firstName} {loggedUser.lastName}</p>
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
        onChange={e => setLogin(e.target.value)}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Hasło"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit">Zaloguj</button>
    </form>
  );
};

export default LoginForm;
