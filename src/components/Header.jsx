"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Search, ShoppingCart, Heart, User, Menu, X, Leaf, LogOut, Settings, Package, Phone } from "lucide-react"
import { auth } from "../utils/api"
import authService from "../services/authService"

export default function Header() {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const updateCounts = () => {
      // Using localStorage for cart and wishlist counts
      let cart = []
      let wishlist = []
      try {
        cart = JSON.parse(localStorage.getItem("cart") || "[]")
      } catch {
        cart = []
      }
      try {
        wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
      } catch {
        wishlist = []
      }
      setCartCount(Array.isArray(cart) ? cart.reduce((total, item) => total + (item.quantity || 0), 0) : 0)
      setWishlistCount(Array.isArray(wishlist) ? wishlist.length : 0)
    }

    const updateAuthStatus = () => {
      const authenticated = auth.isAuthenticated()
      setIsAuthenticated(authenticated)
      if (authenticated) {
        setCurrentUser(auth.getCurrentUser())
      } else {
        setCurrentUser(null)
      }
    }

    updateCounts()
    updateAuthStatus()

    window.addEventListener("storage", updateCounts)
    window.addEventListener("cartUpdated", updateCounts)
    window.addEventListener("wishlistUpdated", updateCounts)

    return () => {
      window.removeEventListener("storage", updateCounts)
      window.removeEventListener("cartUpdated", updateCounts)
      window.removeEventListener("wishlistUpdated", updateCounts)
    }
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleNavClick = (path) => {
    navigate(path)
    setIsMenuOpen(false)
    setIsUserMenuOpen(false)
  }

  const handleLogout = async () => {
    try {
      await authService.logout()
      setIsUserMenuOpen(false)
      // The logout function will handle navigation
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate("/profile")
    } else {
      navigate("/signin")
    }
    setIsUserMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-white shadow-lg rounded-b-2xl">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-2">
            {/* Logo */}
            <img 
              src="/Healeri-Logo.png" 
              alt="Healeri Logo" 
              className="h-12 w-36 object-contain cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => handleNavClick("/")}
              style={{objectFit: "contain"}}
            /> 
            {/* <button onClick={() => handleNavClick("/")} className="flex items-center space-x-3 cursor-pointer">
              <div className="w-8 h-8 bg-plant-dark rounded-full flex items-center justify-center">
                <Leaf className="w-5 h-5 text-plant-yellow" />
              </div>
              <span className="text-xl font-bold text-plant-dark">Plant Shop.</span>
            </button> */}

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {[
                { href: "/", label: "Home" },
                { href: "/products", label: "Products" },
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
              ].map((item) => (
                <button 
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className="text-plant-black hover:text-green-700 text-lg font-semibold transition-colors duration-200 cursor-pointer px-3 py-1 rounded-lg hover:bg-green-50"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center space-x-4">
              <form
                onSubmit={handleSearch}
                className="hidden lg:flex items-center border border-gray-200 rounded-full px-3 py-1.5 bg-white"
              >
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search products"
                  aria-label="Search products"
                  className="w-36 xl:w-48 outline-none text-sm text-gray-700"
                />
                <button type="submit" aria-label="Submit search" className="p-1">
                  <Search className="w-5 h-5 text-plant-black" />
                </button>
              </form>

              <button
                onClick={() => handleNavClick("/wishlist")}
                className="relative p-2 hover:bg-green-50 rounded-full transition-colors cursor-pointer"
              >
                <Heart className="w-6 h-6 text-plant-black" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleNavClick("/cart")}
                className="relative p-2 hover:bg-green-50 rounded-full transition-colors cursor-pointer"
              >
                <ShoppingCart className="w-6 h-6 text-plant-black" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-plant-dark text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User Menu Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="p-2 hover:bg-green-50 rounded-full transition-colors"
                >
                  <User className="w-6 h-6 text-plant-black" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-2">
                    {isAuthenticated ? (
                      <>
                        {/* Authenticated User Menu */}
                        <div className="px-4 py-3 border-b border-gray-200">
                          <p className="text-base font-semibold text-gray-700">Welcome back!</p>
                          <p className="text-base text-green-600 font-bold">
                            {currentUser?.firstName} {currentUser?.lastName}
                          </p>
                        </div>

                        <button
                          onClick={handleProfileClick}
                          className="w-full flex items-center justify-between px-4 py-3 text-lg text-gray-700 hover:bg-green-50 transition-colors cursor-pointer rounded-lg"
                        >
                          <span className="font-semibold">My Profile</span>
                          <Settings className="w-5 h-5 text-green-600" />
                        </button>

                        <button
                          onClick={() => handleNavClick("/orders")}
                          className="w-full flex items-center justify-between px-4 py-3 text-lg text-gray-700 hover:bg-green-50 transition-colors cursor-pointer rounded-lg"
                        >
                          <span className="font-semibold">My Orders</span>
                          <Package className="w-5 h-5 text-green-600" />
                        </button>

                        <div className="border-t border-gray-200 mt-2 pt-2">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-between px-4 py-3 text-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer rounded-lg"
                          >
                            <span className="font-semibold">Sign Out</span>
                            <LogOut className="w-5 h-5 text-red-600" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Guest User Menu */}
                        <div className="px-4 py-3 border-b border-gray-200">
                          <p className="text-base font-semibold text-gray-700">Welcome to Plant Shop</p>
                        </div>
                        {[
                          { href: "/signin", label: "Sign In", icon: "→" },
                          { href: "/signup", label: "Sign Up", icon: "+" },
                        ].map((item) => (
                          <button
                            key={item.href}
                            onClick={() => handleNavClick(item.href)}
                            className="w-full flex items-center justify-between px-4 py-3 text-lg text-gray-700 hover:bg-green-50 transition-colors cursor-pointer rounded-lg"
                          >
                            <span className="font-semibold">{item.label}</span>
                            <span className="text-green-600">{item.icon}</span>
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 hover:bg-green-50 rounded-full transition-colors"
              >
                {isMenuOpen ? <X className="w-7 h-7 text-plant-black" /> : <Menu className="w-7 h-7 text-plant-black" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-2 border-t border-gray-200 rounded-b-xl shadow-lg">
              <nav className="space-y-2">
                {[
                  { href: "/", label: "Home" },
                  { href: "/products", label: "Plants" },
                  { href: "/products?category=pots", label: "Pots & Accessories" },
                  { href: "/products?category=seeds", label: "Seeds" },
                  { href: "/about", label: "About" },
                  { href: "/contact", label: "Blog" },
                  { href: "/wishlist", label: "Wishlist", count: wishlistCount },
                  { href: "/cart", label: "Cart", count: cartCount },
                  ...(isAuthenticated
                    ? [
                        { href: "/profile", label: "My Profile" },
                        { href: "/orders", label: "My Orders" },
                      ]
                    : [
                        { href: "/signin", label: "Sign In" },
                        { href: "/signup", label: "Sign Up" },
                      ]),
                ].map((item) => (
                  <button
                    key={item.href}
                    onClick={() => handleNavClick(item.href)}
                    className="w-full flex items-center justify-between px-4 py-3 text-lg text-plant-black hover:bg-green-50 transition-colors cursor-pointer rounded-lg"
                  >
                    <span className="font-semibold">{item.label}</span>
                    {item.count !== undefined && item.count > 0 && (
                      <span className="bg-plant-dark text-white text-xs rounded-full px-2 py-1 font-bold">
                        {item.count}
                      </span>
                    )}
                  </button>
                ))}

                {isAuthenticated && (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between px-4 py-3 text-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer rounded-lg"
                  >
                    <span className="font-semibold">Sign Out</span>
                    <LogOut className="w-5 h-5" />
                  </button>
                )}
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
