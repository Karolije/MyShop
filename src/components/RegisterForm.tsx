import { useState } from "react";
import { hashPassword } from "../utils/hashPassword";
import type { User } from "../types/User";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    login: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const passwordHash = await hashPassword(formData.password);

    const user: User = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      birthDate: formData.birthDate,
      login: formData.login,
      email: formData.email,
      passwordHash,
    };

    await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    alert("Zarejestrowano!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="firstName" placeholder="Imię" onChange={handleChange} required />
      <input name="lastName" placeholder="Nazwisko" onChange={handleChange} required />
      <input name="birthDate" type="date" onChange={handleChange} required />
      <input name="login" placeholder="Login" onChange={handleChange} required />
      <input name="email" type="email" onChange={handleChange} required />
      <input name="password" type="password" onChange={handleChange} required />
      <button type="submit">Zarejestruj</button>
    </form>
  );
};

export default RegisterForm;
