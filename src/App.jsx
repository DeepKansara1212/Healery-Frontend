
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import About from "./Pages/About"
import Contact from "./Pages/Contact"
import Home from "./Pages/Home"
import Products from "./Pages/Products"
import BulkOrder from "./Pages/BulkOrder"
import ProductDetails from "./products/id/page"
import Signup from "./signup/page"
import Signin from "./signin/page"
import Cart from "./cart/page"
import Wishlist from "./wishlist/page"
import Checkout from "./checkout/page"
import OrderSuccess from "./order-success/[id]/page"
import Orders from "./orders/page"
import Profile from "./profile/page"
import ForgotPasswordPage from "./forgot-password/page"
import ResetPasswordPage from "./reset-password/[token]/page"
import "./App.css"

const HerbalEntryLoader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 4;
      });
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center"
      style={{ backgroundColor: '#F8EFE6' }}
    >
      <div className="text-center space-y-8">
        {/* Company Name */}
        <div 
          className="text-5xl font-light tracking-widest"
          style={{ color: '#2e2e2e' }}
        >
          HEALERI
        </div>
        {/* Loading Progress Bar */}
        <div className="w-80 mx-auto space-y-4">
          <div 
            className="h-1 rounded-full overflow-hidden"
            style={{ backgroundColor: '#b5cbb7', opacity: 0.2 }}
          >
            <div
              className="h-full rounded-full transition-all duration-300 ease-out"
              style={{ 
                backgroundColor: '#2e2e2e',
                width: `${progress}%`
              }}
            />
          </div>
          {/* Percentage Counter */}
          <div 
            className="text-lg font-light"
            style={{ color: '#2e2e2e' }}
          >
            {Math.floor(progress)}%
          </div>
        </div>
      </div>
    </div>
  );
};


function App() {
  const [showLoader, setShowLoader] = useState(() => {
    // Only show loader on first mount (initial load or refresh)
    return window.performance && window.performance.navigation && window.performance.navigation.type === 1 ? true : sessionStorage.getItem('hasLoaded') !== 'true';
  });
  const [hasSet, setHasSet] = useState(false);

  useEffect(() => {
    if (!hasSet && showLoader) {
      sessionStorage.setItem('hasLoaded', 'true');
      setHasSet(true);
    }
    if (!showLoader) return;
    // Hide loader after progress reaches 100%
    const timer = setTimeout(() => setShowLoader(false), 2600);
    return () => clearTimeout(timer);
  }, [showLoader, hasSet]);

  return (
    <div className="min-h-screen bg-white">
      {showLoader ? (
        <HerbalEntryLoader />
      ) : (
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/products" element={<Products />} />
            <Route path="/bulk-order" element={<BulkOrder />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/order-success/:id" element={<OrderSuccess />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      )}
    </div>
  );
}

export default App