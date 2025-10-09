import React from "react";
import Layout from "./components/layout/Layout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Product from "./pages/product/Product";
import Cart from "./pages/cart/Cart";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OrderPage from "./pages/order/Order";
import ResetPassword from "./pages/auth/ResetPassword";
import SellerDashboard from "./pages/product/ProductSeller";
import Dashboard from "./pages/seller/Dashboard";

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Product />} />
          <Route path="/seller" element={<SellerDashboard />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
