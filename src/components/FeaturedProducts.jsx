"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronLeft, ChevronRight, Star, Heart, ShoppingCart } from "lucide-react"
import productService from "../services/productService"
import cartService from "../services/cartService"
import wishlistService from "../services/wishlistService"
import { auth } from "../utils/api"

export default function FeaturedProducts() {
  const navigate = useNavigate()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [hoveredProduct, setHoveredProduct] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Fetch featured products from API
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true)
        const data = await productService.getFeaturedProducts()
        setProducts(data.products || [])
      } catch (error) {
        setError(error.message)
        console.error("Failed to fetch featured products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(products.length / 3))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(products.length / 3)) % Math.ceil(products.length / 3))
  }

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`)
  }

  const handleAddToCart = async (product, e) => {
    e.stopPropagation()

    if (!auth.isAuthenticated()) {
      // Store in localStorage for guest users
      const existingCart = JSON.parse(localStorage.getItem("cart") || "[]")
      const cart = Array.isArray(existingCart) ? existingCart : []
      const existingItem = cart.find((item) => item.id === product._id)

      let updatedCart
      if (existingItem) {
        updatedCart = cart.map((item) => (item.id === product._id ? { ...item, quantity: item.quantity + 1 } : item))
      } else {
        const newItem = {
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.bannerImage,
          quantity: 1,
        }
        updatedCart = [...cart, newItem]
      }

      localStorage.setItem("cart", JSON.stringify(updatedCart))
      window.dispatchEvent(new Event("cartUpdated"))

      // Show success message
      alert("Product added to cart!")
      return
    }

    // For authenticated users, use API
    try {
      const serverCart = await cartService.addToCart(product._id, 1)
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
    }
  }

  const handleAddToWishlist = async (product, e) => {
    e.stopPropagation()

    if (!auth.isAuthenticated()) {
      // Store in localStorage for guest users
      const existingWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
      const wishlist = Array.isArray(existingWishlist) ? existingWishlist : []
      const existingItem = wishlist.find((item) => item.id === product._id)

      if (!existingItem) {
        const newItem = {
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.bannerImage,
        }
        const updatedWishlist = [...wishlist, newItem]
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist))
        window.dispatchEvent(new Event("wishlistUpdated"))
        alert("Product added to wishlist!")
      } else {
        alert("Product already in wishlist!")
      }
      return
    }

    // For authenticated users, use API
    try {
      const serverWishlist = await wishlistService.addToWishlist(product._id)
      // serverWishlist is now an array of product IDs from User model
      try {
        const mapped = serverWishlist.map((productId) => ({
          id: productId,
          name: product.name,
          price: product.price,
          image: product.bannerImage,
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
    }
  }

  if (loading) {
    return (
      <section className="py-4 sm:py-6 md:py-8 lg:py-10 bg-white">
        <div className="container mx-auto px-2 sm:px-4 md:px-6 max-w-7xl">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-plant-green mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading featured products...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-4 sm:py-6 md:py-8 lg:py-10 bg-white">
        <div className="container mx-auto px-2 sm:px-4 md:px-6 max-w-7xl">
          <div className="text-center py-12">
            <p className="text-red-600">Failed to load featured products: {error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 btn-plant-primary">
              Try Again
            </button>
          </div>
        </div>
      </section>
    )
  }

  if (!products || products.length === 0) {
    return (
      <section className="py-4 sm:py-6 md:py-8 lg:py-10 bg-white">
        <div className="container mx-auto px-2 sm:px-4 md:px-6 max-w-7xl">
          <div className="text-center py-12">
            <p className="text-gray-600">No featured products available at the moment.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-3 sm:py-4 md:py-6 lg:py-8 bg-white">
      <div className="container mx-auto px-2 sm:px-4 md:px-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-8 sm:mb-12 md:mb-14 lg:mb-16 gap-4 sm:gap-0">
          <div>
            <p className="text-plant-orange font-semibold text-xs sm:text-sm tracking-wider uppercase mb-2 sm:mb-4">
              Our Products
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-plant-green leading-tight">
              Featured Products
            </h2>
          </div>

          {/* Navigation - Desktop */}
          {products.length > 3 && (
            <div className="hidden md:flex space-x-2">
              <button
                onClick={prevSlide}
                className="w-10 h-10 md:w-12 md:h-12 bg-white hover:bg-plant-green hover:text-white rounded-full flex items-center justify-center transition-colors duration-200 shadow-md"
              >
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="w-10 h-10 md:w-12 md:h-12 bg-white hover:bg-plant-green hover:text-white rounded-full flex items-center justify-center transition-colors duration-200 shadow-md"
              >
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Products Slider */}
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {Array.from({ length: Math.ceil(products.length / 3) }).map((_, slideIndex) => (
              <div key={slideIndex} className="w-full flex-shrink-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
                  {products.slice(slideIndex * 3, slideIndex * 3 + 3).map((product) => (
                    <div
                      key={product._id}
                      className="group plant-card hover:shadow-plant-card-hover transition-all duration-300 cursor-pointer overflow-hidden"
                      onMouseEnter={() => setHoveredProduct(product._id)}
                      onMouseLeave={() => setHoveredProduct(null)}
                      onClick={() => handleProductClick(product._id)}
                    >
                      {/* Product Image */}
                      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                        <img
                          src={product.bannerImage || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Badge */}
                        {product.isFeatured && (
                          <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
                            <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold text-white bg-plant-orange">
                              Featured
                            </span>
                          </div>
                        )}

                        {/* Actions - Hover */}
                        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex flex-col space-y-1 sm:space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button
                            onClick={(e) => handleAddToWishlist(product, e)}
                            className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full shadow-md hover:bg-red-50 flex items-center justify-center transition-colors"
                          >
                            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 hover:text-red-500 transition-colors" />
                          </button>
                          <button
                            onClick={(e) => handleAddToCart(product, e)}
                            className="w-8 h-8 sm:w-10 sm:h-10 bg-plant-orange rounded-full shadow-md hover:bg-plant-orange-dark flex items-center justify-center transition-colors"
                          >
                            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          </button>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-3 sm:p-4">
                        <div className="mb-2">
                          <p className="text-xs sm:text-sm text-plant-orange font-semibold uppercase tracking-wide">
                            {product.category?.name || "Plants"}
                          </p>
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-plant-green mb-2 line-clamp-2">
                          {product.name}
                        </h3>

                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">{product.description}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="ml-1 text-sm font-medium text-gray-900">{product.rating || 4.5}</span>
                            </div>
                            <span className="text-sm text-gray-500">({product.numReviews || 0})</span>
                          </div>

                          <div className="text-right">
                            <div className="flex items-center space-x-2">
                              {product.originalPrice && product.originalPrice > product.price && (
                                <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                              )}
                              <span className="text-base sm:text-lg font-bold text-plant-green">${product.price}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
