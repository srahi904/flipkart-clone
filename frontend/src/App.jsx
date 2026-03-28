import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from './components/layout/Layout';
import Toast from './components/common/Toast';
import ROUTES from './constants/routes';
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import WishlistPage from './pages/WishlistPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

function RequireAuth({ children }) {
  const token = useSelector((state) => state.auth.token);
  const location = useLocation();

  if (!token) {
    return <Navigate to={ROUTES.login} replace state={{ from: location.pathname }} />;
  }

  return children;
}

function App() {
  return (
    <>
      <Routes>
        <Route
          path={ROUTES.home}
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />
        <Route
          path={ROUTES.products}
          element={
            <Layout>
              <ProductListPage />
            </Layout>
          }
        />
        <Route
          path={ROUTES.productDetail}
          element={
            <Layout>
              <ProductDetailPage />
            </Layout>
          }
        />
        <Route
          path={ROUTES.cart}
          element={
            <Layout>
              <RequireAuth>
                <CartPage />
              </RequireAuth>
            </Layout>
          }
        />
        <Route
          path={ROUTES.checkout}
          element={
            <Layout>
              <RequireAuth>
                <CheckoutPage />
              </RequireAuth>
            </Layout>
          }
        />
        <Route
          path={ROUTES.orderSuccess}
          element={
            <Layout>
              <RequireAuth>
                <OrderSuccessPage />
              </RequireAuth>
            </Layout>
          }
        />
        <Route
          path={ROUTES.orders}
          element={
            <Layout>
              <RequireAuth>
                <OrderHistoryPage />
              </RequireAuth>
            </Layout>
          }
        />
        <Route
          path={ROUTES.wishlist}
          element={
            <Layout>
              <RequireAuth>
                <WishlistPage />
              </RequireAuth>
            </Layout>
          }
        />
        <Route path={ROUTES.login} element={<LoginPage />} />
        <Route path={ROUTES.register} element={<RegisterPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toast />
    </>
  );
}

export default App;
