"use client"

import { useState, useEffect } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { Heart, X, ArrowRight } from "lucide-react"
import wishlistService from "../services/wishlistService"
import { auth } from "../utils/api"

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const hydrateWishlist = async () => {
      try {
        if (auth.isAuthenticated()) {
          const serverWishlist = await wishlistService.getWishlist()
          const mapped = (serverWishlist?.items || []).map((it) => ({
            id: it.product?._id || it.product,
            name: it.product?.name,
            price: it.product?.price,
            image: it.product?.bannerImage || it.product?.image,
            originalPrice: it.product?.originalPrice,
            rating: it.product?.rating,
            reviews: it.product?.reviews,
            dateAdded: new Date().toLocaleDateString(), // Mock date
            stockStatus: "Instock", // Mock stock status
          }))
          setWishlistItems(mapped)
          localStorage.setItem("wishlist", JSON.stringify(mapped))
          window.dispatchEvent(new Event("wishlistUpdated"))
        } else {
          const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
          const mappedWishlist = (Array.isArray(wishlist) ? wishlist : []).map((item) => ({
            ...item,
            dateAdded: new Date().toLocaleDateString(),
            stockStatus: "Instock",
          }))
          setWishlistItems(mappedWishlist)
        }
      } catch (err) {
        const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
        const mappedWishlist = (Array.isArray(wishlist) ? wishlist : []).map((item) => ({
          ...item,
          dateAdded: new Date().toLocaleDateString(),
          stockStatus: "Instock",
        }))
        setWishlistItems(mappedWishlist)
        window.dispatchEvent(new Event("wishlistUpdated"))
      } finally {
        setIsLoading(false)
      }
    }

    hydrateWishlist()

    const handleWishlistUpdate = () => {
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
      const mappedWishlist = (Array.isArray(wishlist) ? wishlist : []).map((item) => ({
        ...item,
        dateAdded: new Date().toLocaleDateString(),
        stockStatus: "Instock",
      }))
      setWishlistItems(mappedWishlist)
    }
    window.addEventListener("wishlistUpdated", handleWishlistUpdate)
    return () => window.removeEventListener("wishlistUpdated", handleWishlistUpdate)
  }, [])

  const removeFromWishlist = async (id) => {
    try {
      if (auth.isAuthenticated()) {
        const serverWishlist = await wishlistService.removeFromWishlist(id)
        const mapped = (serverWishlist?.items || []).map((it) => ({
          id: it.product?._id || it.product,
          name: it.product?.name,
          price: it.product?.price,
          image: it.product?.bannerImage || it.product?.image,
          originalPrice: it.product?.originalPrice,
          rating: it.product?.rating,
          reviews: it.product?.reviews,
          dateAdded: new Date().toLocaleDateString(),
          stockStatus: "Instock",
        }))
        setWishlistItems(mapped)
        localStorage.setItem("wishlist", JSON.stringify(mapped))
      } else {
        const updatedWishlist = wishlistItems.filter((item) => item.id !== id)
        setWishlistItems(updatedWishlist)
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist))
      }
    } catch (e) {
      // Fallback to local removal when token is invalid/expired or any API error occurs
      const updatedWishlist = wishlistItems.filter((item) => item.id !== id)
      setWishlistItems(updatedWishlist)
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist))
    } finally {
      window.dispatchEvent(new Event("wishlistUpdated"))
    }
  }

  const addToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const existingItem = cart.find((cartItem) => cartItem.id === item.id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1,
      })
    }

    localStorage.setItem("cart", JSON.stringify(cart))
    window.dispatchEvent(new Event("cartUpdated"))
  }

  const clearWishlist = async () => {
    try {
      if (auth.isAuthenticated()) {
        await wishlistService.clearWishlist()
      }
      setWishlistItems([])
      localStorage.setItem("wishlist", JSON.stringify([]))
    } catch (e) {
      // If server call fails (e.g., invalid token), still clear locally
      setWishlistItems([])
      localStorage.setItem("wishlist", JSON.stringify([]))
    } finally {
      window.dispatchEvent(new Event("wishlistUpdated"))
    }
  }

  const addAllToCart = () => {
    wishlistItems.forEach((item) => addToCart(item))
    alert("All items added to cart!")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your wishlist...</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <span>Home</span>
          <span>/</span>
          <span className="text-gray-900 font-medium">Wishlist</span>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Wishlist</h1>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8">Save your favorite plants for later</p>
            <a
              href="/products"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center space-x-2"
            >
              <span>Explore Plants</span>
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        ) : (
          <div>
            {/* Wishlist Table */}
            <div className="bg-white rounded-lg overflow-hidden mb-8">
              {/* Table Header */}
              <div className="bg-yellow-400 px-6 py-4">
                <div className="grid grid-cols-12 gap-4 font-semibold text-gray-900">
                  <div className="col-span-5">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Date Added</div>
                  <div className="col-span-2 text-center">Stock Status</div>
                  <div className="col-span-1 text-center">Action</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-200">
                {wishlistItems.map((item) => (
                  <div key={item.id} className="px-6 py-6">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Product Info */}
                      <div className="col-span-5 flex items-center gap-4">
                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-500">Indoor Plant</p>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="col-span-2 text-center">
                        <span className="font-semibold text-gray-900">₹{item.price}</span>
                      </div>

                      {/* Date Added */}
                      <div className="col-span-2 text-center">
                        <span className="text-gray-600">{item.dateAdded}</span>
                      </div>

                      {/* Stock Status */}
                      <div className="col-span-2 text-center">
                        <span className="text-green-600 font-medium">{item.stockStatus}</span>
                      </div>

                      {/* Action */}
                      <div className="col-span-1 text-center">
                        <button
                          onClick={() => addToCart(item)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Wishlist Actions */}
              <div className="px-6 py-6 border-t border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="font-medium text-gray-700">Wishlist link:</span>
                  <input
                    type="text"
                    value={typeof window !== "undefined" ? `${window.location.origin}/wishlist` : ""}
                    readOnly
                    className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                  <button
                    onClick={async () => {
                      try {
                        const link = `${window.location.origin}/wishlist`
                        if (navigator?.clipboard?.writeText) {
                          await navigator.clipboard.writeText(link)
                          alert("Wishlist link copied!")
                        } else {
                          // Fallback
                          const el = document.createElement("textarea")
                          el.value = link
                          document.body.appendChild(el)
                          el.select()
                          document.execCommand("copy")
                          document.body.removeChild(el)
                          alert("Wishlist link copied!")
                        }
                      } catch (e) {
                        alert("Failed to copy link")
                      }
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    Copy Link
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={clearWishlist}
                    className="text-gray-600 hover:text-red-600 font-medium transition-colors"
                  >
                    Clear Wishlist
                  </button>
                  <button
                    onClick={addAllToCart}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    Add All to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="flex items-center gap-4 bg-white p-6 rounded-lg">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-yellow-500 rounded"></div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Free Shipping</h3>
              <p className="text-sm text-gray-600">Free shipping for order above ₹50</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white p-6 rounded-lg">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-yellow-500 rounded"></div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Flexible Payment</h3>
              <p className="text-sm text-gray-600">Multiple secure payment options</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white p-6 rounded-lg">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-yellow-500 rounded"></div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">24×7 Support</h3>
              <p className="text-sm text-gray-600">We support online all days.</p>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="bg-gray-100 rounded-lg p-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Our Newsletter</h2>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Subscribe to Our Newsletter to
            <br />
            Get Updates on Our Latest Offers
          </h3>
          <p className="text-gray-600 mb-8">Get 25% off on your first order just by subscribing to our newsletter</p>

          <div className="flex items-center justify-center gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter Email Address"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <button className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
