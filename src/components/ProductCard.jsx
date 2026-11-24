"use client"

import { useState } from "react"
import { Star, Heart, ShoppingCart } from "lucide-react"
import cartService from "../services/cartService"
import wishlistService from "../services/wishlistService"
import { auth } from "../utils/api"

export default function ProductCard({ product, viewMode = "grid" }) {
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false)

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (isAddingToCart) return

    setIsAddingToCart(true)

    if (!auth.isAuthenticated()) {
      // Store in localStorage for guest users
      const existingCart = JSON.parse(localStorage.getItem("cart") || "[]")
      const cart = Array.isArray(existingCart) ? existingCart : []
      const existingItem = cart.find((item) => item.id === product._id || item.id === product.id)

      let updatedCart
      if (existingItem) {
        updatedCart = cart.map((item) =>
          item.id === product._id || item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      } else {
        const newItem = {
          id: product._id || product.id,
          name: product.name,
          price: product.price,
          image: product.image || product.bannerImage,
          quantity: 1,
        }
        updatedCart = [...cart, newItem]
      }

      localStorage.setItem("cart", JSON.stringify(updatedCart))
      window.dispatchEvent(new Event("cartUpdated"))
      alert("Product added to cart!")
      setIsAddingToCart(false)
      return
    }

    // For authenticated users, use API
    try {
      const serverCart = await cartService.addToCart(product._id || product.id, 1)
      try {
        const mapped = (serverCart?.items || []).map((it) => ({
          id: it.product?._id || it.product,
          name: it.product?.name,
          price: it.price,
          image: it.product?.bannerImage,
          quantity: it.quantity,
        }))
        localStorage.setItem("cart", JSON.stringify(mapped))
        window.dispatchEvent(new Event("cartUpdated"))
      } catch (mappingError) {
        console.error("Error mapping cart data:", mappingError)
      }
      alert("Product added to cart!")
    } catch (error) {
      console.error("Add to cart error:", error)
      alert(`Failed to add to cart: ${error.message}`)
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleAddToWishlist = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (isAddingToWishlist) return

    setIsAddingToWishlist(true)

    if (!auth.isAuthenticated()) {
      // Store in localStorage for guest users
      const existingWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
      const wishlist = Array.isArray(existingWishlist) ? existingWishlist : []
      const existingItem = wishlist.find((item) => item.id === product._id || item.id === product.id)

      if (!existingItem) {
        const newItem = {
          id: product._id || product.id,
          name: product.name,
          price: product.price,
          image: product.image || product.bannerImage,
        }
        const updatedWishlist = [...wishlist, newItem]
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist))
        window.dispatchEvent(new Event("wishlistUpdated"))
        alert("Product added to wishlist!")
      } else {
        alert("Product already in wishlist!")
      }
      setIsAddingToWishlist(false)
      return
    }

    // For authenticated users, use API
    try {
      const serverWishlist = await wishlistService.addToWishlist(product._id || product.id)
      // Map server wishlist document to lightweight local items for quick UI updates
      try {
        const mapped = (serverWishlist?.items || []).map((it) => ({
          id: it.product?._id || it.product,
          name: it.product?.name,
          price: it.product?.price ?? product.price,
          image: it.product?.bannerImage || it.product?.image || product.image || product.bannerImage,
        }))
        localStorage.setItem("wishlist", JSON.stringify(mapped))
        window.dispatchEvent(new Event("wishlistUpdated"))
      } catch (mappingError) {
        console.error("Error mapping wishlist data:", mappingError)
      }
      alert("Product added to wishlist!")
    } catch (error) {
      console.error("Add to wishlist error:", error)
      alert(`Failed to add to wishlist: ${error.message}`)
    } finally {
      setIsAddingToWishlist(false)
    }
  }
  if (viewMode === "list") {
    return (
      <div className="plant-card p-6 hover:shadow-plant-card-hover transition-all duration-300 group">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-48 flex-shrink-0">
            <div className="relative">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-48 object-cover rounded-xl"
              />
              {product.badge && (
                <span
                  className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${
                    product.badge === "Best Seller" ? "bg-plant-orange text-white" : "bg-plant-green text-white"
                  }`}
                >
                  {product.badge}
                </span>
              )}
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-plant-green font-semibold capitalize">{product.category}</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-gray-600">
                    {product.rating} ({product.reviews})
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-plant-green mb-2">{product.name}</h3>

              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-plant-green">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-400 line-through">${product.originalPrice}</span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleAddToWishlist}
                  disabled={isAddingToWishlist}
                  className="p-2 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                >
                  <Heart className={`w-5 h-5 ${isAddingToWishlist ? "text-red-500" : "text-gray-600"}`} />
                </button>
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className="btn-plant-primary flex items-center space-x-2 disabled:opacity-50"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{isAddingToCart ? "Adding..." : "Add to Cart"}</span>
                </button>
                <a href={`/products/${product.id}`} className="btn-plant-secondary">
                  View Details
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="plant-card p-6 hover:shadow-plant-card-hover transition-all duration-300 transform hover:-translate-y-2 group">
      <div className="relative mb-4">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-48 object-cover rounded-xl"
        />

        {product.badge && (
          <span
            className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${
              product.badge === "Best Seller" ? "bg-plant-orange text-white" : "bg-plant-green text-white"
            }`}
          >
            {product.badge}
          </span>
        )}

        <button
          onClick={handleAddToWishlist}
          disabled={isAddingToWishlist}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
        >
          <Heart className={`w-4 h-4 ${isAddingToWishlist ? "text-red-500" : "text-gray-600"}`} />
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-plant-green font-semibold capitalize">{product.category}</span>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-gray-600">
              {product.rating} ({product.reviews})
            </span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-plant-green">{product.name}</h3>

        <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-plant-green">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="bg-plant-orange hover:bg-plant-orange-dark text-white px-3 py-2 rounded-full font-semibold transition-colors text-sm disabled:opacity-50 flex items-center space-x-1"
            >
              <ShoppingCart className="w-3 h-3" />
              <span>{isAddingToCart ? "Adding..." : "Add"}</span>
            </button>
            <a
              href={`/products/${product.id}`}
              className="border-2 border-plant-green text-plant-green hover:bg-plant-green hover:text-white px-3 py-2 rounded-full font-semibold transition-colors text-sm"
            >
              View
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
