import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import CreateOrder from './pages/CrateOrder';
import OrderHistory from './components/OrderHistory';
import Layout from './components/Layout';
import PublicRoute from './routes/PublicRoute';
import PrivateRoute from './routes/PrivateRoute';

const App = () => {
  return (
    <Routes>
    {/* Publiczne strony dostępne bez logowania */}
    <Route path="/" element={<Layout />}>
      <Route index element={<ProductList />} />
      <Route path="products" element={<ProductList />} />
      <Route path="login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
    </Route>
  
    {/* Prywatne strony - wymagają zalogowania */}
    <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
      <Route path="cart" element={<Cart />} />
      <Route path="create-order" element={<CreateOrder />} />
      <Route path="order-history" element={<OrderHistory />} />
    </Route>
  
    {/* Admin */}
    <Route path="/admin" element={<AdminPage />} />
  </Routes>
  
  );
};

export default App;
