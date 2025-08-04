import { useState, useEffect } from "react";
import type { User } from "../types/User";
import { hashPassword } from "../utils/hashPassword";

const LoginForm = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loggedUser, setLoggedUser] = useState<User | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetch(`http://localhost:3000/users/${userId}`)
        .then(res => res.json())
        .then((user: User) => setLoggedUser(user))
        .catch(() => localStorage.removeItem("userId"));
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
      localStorage.setItem("userId", String(user.id));
      setLoggedUser(user);
      setLogin("");
      setPassword("");
      alert(`Zalogowano jako ${user.firstName}`);
    } else {
      alert("Błędne hasło");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    setLoggedUser(null);
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
