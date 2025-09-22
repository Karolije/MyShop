import { useState } from "react";
import { hashPassword } from "../utils/hashPassword";
import type { User } from "../types/User";
import { supabase } from "../supabaseClient";

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

    const user: Omit<User, "id"> = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      birthDate: formData.birthDate,
      login: formData.login,
      email: formData.email,
      passwordHash,
    };

    try {
      const { data, error } = await supabase
        .from("users")
        .insert(user)
        .select()
        .single();

      if (error) throw error;

      alert(`Zarejestrowano użytkownika ${data.firstName}`);
      setFormData({
        firstName: "",
        lastName: "",
        birthDate: "",
        login: "",
        email: "",
        password: "",
      });
    } catch (err: any) {
      alert(`Coś poszło nie tak: ${err.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="firstName"
        placeholder="Imię"
        value={formData.firstName}
        onChange={handleChange}
        required
      />
      <input
        name="lastName"
        placeholder="Nazwisko"
        value={formData.lastName}
        onChange={handleChange}
        required
      />
      <input
        name="birthDate"
        type="date"
        value={formData.birthDate}
        onChange={handleChange}
        required
      />
      <input
        name="login"
        placeholder="Login"
        value={formData.login}
        onChange={handleChange}
        required
      />
      <input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <button type="submit">Zarejestruj</button>
    </form>
  );
};

export default RegisterForm;
