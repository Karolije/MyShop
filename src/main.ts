import type { User } from './types/index';

const form = document.getElementById('register-form') as HTMLFormElement;

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const data: Omit<User, 'id' | 'passwordHash'> & { password: string } = {
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    birthDate: formData.get('birthDate') as string,
    login: formData.get('login') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const passwordHash = btoa(data.password); 

  const newUser: Omit<User, 'id'> = {
    ...data,
    passwordHash,
  };

  const res = await fetch('http://localhost:3000/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newUser),
  });

  if (res.ok) {
    alert('Zarejestrowano!');
    form.reset();
  } else {
    alert('Wystąpił błąd przy rejestracji');
  }
});
