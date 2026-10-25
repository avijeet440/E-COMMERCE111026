
import React from 'react'
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Navbar from './components/Navbar'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx';
import Products from './pages/Products.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Checkout from './pages/Checkout.jsx';
import Orders from './pages/Orders.jsx';
import OrderDetails from './pages/OrderDetails.jsx';
import Cart from './pages/Cart.jsx';
import Bucketlist from "./pages/Bucketlist.jsx";
const App = () => {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/forgot-password" element={<ForgotPassword />}  />

        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}/>

        <Route element={<ProtectedRoute />}>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path='/orders:id' element={<OrderDetails />} />
          <Route path='/cart' element={<Cart />} />
          <Route path="/bucketlist" element={<Bucketlist />} />
        </Route>
        
      </Routes>

    </>
  )
}

export default App
