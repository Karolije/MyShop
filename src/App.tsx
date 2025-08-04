import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import CreateOrder from './pages/CrateOrder';
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/products" element={<ProductList />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/create-order" element={<CreateOrder />} />

    </Routes>
  );
};

export default App;
