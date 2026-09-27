import { Routes, Route } from 'react-router-dom';
import { NotificationProvider } from './context/NotificationContext.jsx';
import { AdminAuthProvider } from './context/AdminAuthContext.jsx';
import { ProductsProvider } from './context/ProductsContext.jsx';
import { AppProvider } from './context/AppContext.jsx';

import RequireAuth from './components/RequireAuth.jsx';
import RequireAdmin from './components/RequireAdmin.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ToastStack from './components/ToastStack.jsx';

import SignUp from './pages/SignUp.jsx';
import SignIn from './pages/SignIn.jsx';
import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Checkout from './pages/Checkout.jsx';
import Confirm from './pages/Confirm.jsx';
import NotFound from './pages/NotFound.jsx';

import AdminLogin from './pages/admin/AdminLogin.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminProductForm from './pages/admin/AdminProductForm.jsx';

export default function App() {
  return (
    <NotificationProvider>
      <AdminAuthProvider>
        <ProductsProvider>
          <AppProvider>
            <Header />

            <Routes>
              {/* Public — reachable without a customer account */}
              <Route path="/signup" element={<SignUp />} />
              <Route path="/signin" element={<SignIn />} />

              {/* Admin auth is separate from the customer account above and
                  talks to the real api.oluwasetemi.dev auth endpoints. */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <RequireAdmin>
                    <AdminDashboard />
                  </RequireAdmin>
                }
              />
              <Route
                path="/admin/products/new"
                element={
                  <RequireAdmin>
                    <AdminProductForm />
                  </RequireAdmin>
                }
              />
              <Route
                path="/admin/products/:id/edit"
                element={
                  <RequireAdmin>
                    <AdminProductForm />
                  </RequireAdmin>
                }
              />

              {/* Everything else requires a customer account — sign up is
                  the front door of the storefront. */}
              <Route
                path="/"
                element={
                  <RequireAuth>
                    <Home />
                  </RequireAuth>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <RequireAuth>
                    <Dashboard />
                  </RequireAuth>
                }
              />
              <Route
                path="/checkout"
                element={
                  <RequireAuth>
                    <Checkout />
                  </RequireAuth>
                }
              />
              <Route
                path="/confirm"
                element={
                  <RequireAuth>
                    <Confirm />
                  </RequireAuth>
                }
              />
              <Route
                path="*"
                element={
                  <RequireAuth>
                    <NotFound />
                  </RequireAuth>
                }
              />
            </Routes>

            <Footer />
            <ToastStack />
          </AppProvider>
        </ProductsProvider>
      </AdminAuthProvider>
    </NotificationProvider>
  );
}
