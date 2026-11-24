"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star, ShoppingCart, X, Heart, ChevronDown } from "lucide-react";
import productService from "../services/productService";
import cartService from "../services/cartService";
import wishlistService from "../services/wishlistService";
import { auth } from "../utils/api";

// ProductCard component
const ProductCard = ({ product, viewMode, onAddToCart, onAddToWishlist }) => {
  const navigate = useNavigate();

  const handleProductClick = () => {
    navigate(`/products/${product._id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  const handleAddToWishlist = (e) => {
    e.stopPropagation();
    onAddToWishlist(product);
  };

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group relative"
      onClick={handleProductClick}
    >
      {/* Discount Badge */}
      {product.originalPrice && product.originalPrice > product.price && (
        <div className="absolute top-3 left-3 bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold z-10">
          {Math.round(
            ((product.originalPrice - product.price) / product.originalPrice) *
              100
          )}
          % off
        </div>
      )}

      {/* Wishlist Button */}
      <button
        onClick={handleAddToWishlist}
        className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-600 p-2 rounded-full border border-gray-200 hover:bg-white hover:shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100 z-10"
      >
        <Heart className="w-4 h-4" />
      </button>

      <div className="relative overflow-hidden bg-gray-50">
        <img
          src={product.bannerImage || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs text-gray-500 uppercase tracking-wide">
            {product.category?.name || "Indoor Plant"}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating || 4.5)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-semibold text-gray-700 ml-1">
            {(product.rating || 4.5).toFixed(1)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">
              ₹{product.price}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-400 line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors duration-200"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Header component (removed as it's not part of the new design)
// const Header = () => ( ... )

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([199, 499]);
  const [selectedRating, setSelectedRating] = useState("all");
  const [selectedLightRequirement, setSelectedLightRequirement] =
    useState("all");
  const [selectedPotSize, setSelectedPotSize] = useState("all");
  const [selectedAvailability, setSelectedAvailability] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Default Sorting");

  // API Data States
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        console.log("Fetching products and categories...");
        
        // Fetch products and categories in parallel
        const [productsData, categoriesData] = await Promise.all([
          productService.getProducts(),
          productService.getCategories(),
        ]);

        console.log("Products data:", productsData);
        console.log("Categories data:", categoriesData);

        // Normalize various API shapes gracefully
        const products =
          productsData?.data?.products ||
          productsData?.data?.data?.products ||
          productsData?.products ||
          productsData?.data?.items ||
          (Array.isArray(productsData) ? productsData : []);
        const categories =
          categoriesData?.data?.categories ||
          categoriesData?.categories ||
          (Array.isArray(categoriesData) ? categoriesData : []);
        
        console.log("Setting products:", products);
        console.log("Setting categories:", categories);
        
        setProducts(products);
        setCategories(categories);
      } catch (error) {
        setError(error.message);
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters and sorting when data or filters change
  useEffect(() => {
    if (products && products.length > 0) {
      const filtered = products.filter((product) => {
        // Updated category matching logic
        const categoryMatch =
          selectedCategory === "all" ||
          (selectedCategory === "herbal-powders" &&
            product.category?.name?.toLowerCase().includes("powder")) ||
          (selectedCategory === "herbal-tablets" &&
            product.category?.name?.toLowerCase().includes("tablet"));

        // Ensure numeric comparison even if API sends strings
        const price = typeof product.price === "number" ? product.price : Number(product.price);
        const priceMatch =
          !Number.isNaN(price) && price >= priceRange[0] && price <= priceRange[1];
        const searchMatch =
          searchQuery === "" ||
          (product.name || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (product.description || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (product.category?.name &&
            product.category.name
              .toLowerCase()
              .includes(searchQuery.toLowerCase()));

        // Add other filter conditions here if they are implemented in the UI
        // const ratingMatch = selectedRating === "all" || Math.floor(product.rating || 0) === parseInt(selectedRating);
        // const lightMatch = selectedLightRequirement === "all" || product.lightRequirement?.toLowerCase() === selectedLightRequirement.toLowerCase();
        // const potSizeMatch = selectedPotSize === "all" || product.potSize?.toLowerCase() === selectedPotSize.toLowerCase();
        // const availabilityMatch = selectedAvailability === "all" || (selectedAvailability === "in-stock" && product.stock > 0) || (selectedAvailability === "out-of-stock" && product.stock === 0);

        return categoryMatch && priceMatch && searchMatch; // && ratingMatch && lightMatch && potSizeMatch && availabilityMatch
      });

      // Apply sorting
      filtered.sort((a, b) => {
        switch (sortBy) {
          case "Price: Low to High":
            return a.price - b.price;
          case "Price: High to Low":
            return b.price - a.price;
          case "Highest Rated":
            return (b.rating || 0) - (a.rating || 0);
          case "Name A-Z":
            return a.name.localeCompare(b.name);
          case "Default Sorting":
          default:
            return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
        }
      });

      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [
    products,
    selectedCategory,
    priceRange,
    searchQuery,
    sortBy,
    selectedRating,
    selectedLightRequirement,
    selectedPotSize,
    selectedAvailability,
  ]);

  // Ensure price range is always valid (this part might need adjustment based on new min/max)
  useEffect(() => {
    if (priceRange[0] < 199) {
      setPriceRange([199, priceRange[1]]);
    }
    if (priceRange[1] <= priceRange[0]) {
      setPriceRange([priceRange[0], Math.min(499, priceRange[0] + 1)]);
    }
  }, [priceRange]);

  // Handle URL parameters (this part might need to be updated if URL params change)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const search = urlParams.get("search");
    const category = urlParams.get("category");
    if (search) {
      setSearchQuery(search);
    }
    if (category) {
      setSelectedCategory(category);
    }
  }, []);

  // Add to cart handler
  const handleAddToCart = async (product) => {
    if (!auth.isAuthenticated()) {
      // Store in localStorage for guest users
      const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
      const cart = Array.isArray(existingCart) ? existingCart : [];
      const existingItem = cart.find((item) => item.id === product._id);

      let updatedCart;
      if (existingItem) {
        updatedCart = cart.map((item) =>
          item.id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        const newItem = {
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.bannerImage,
          quantity: 1,
        };
        updatedCart = [...cart, newItem];
      }

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      window.dispatchEvent(new Event("cartUpdated"));
      alert("Product added to cart!");
      return;
    }

    // For authenticated users, use API
    try {
      await cartService.addToCart(product._id, 1);
      alert("Product added to cart!");
    } catch (error) {
      console.error("Add to cart error:", error);
      alert(`Failed to add to cart: ${error.message}`);
    }
  };

  // Add to wishlist handler
  const handleAddToWishlist = async (product) => {
    if (!auth.isAuthenticated()) {
      // Store in localStorage for guest users
      const existingWishlist = JSON.parse(
        localStorage.getItem("wishlist") || "[]"
      );
      const wishlist = Array.isArray(existingWishlist) ? existingWishlist : [];
      const existingItem = wishlist.find((item) => item.id === product._id);

      if (!existingItem) {
        const newItem = {
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.bannerImage,
        };
        const updatedWishlist = [...wishlist, newItem];
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
        window.dispatchEvent(new Event("wishlistUpdated"));
        alert("Product added to wishlist!");
      } else {
        alert("Product already in wishlist!");
      }
      return;
    }

    // For authenticated users, use API
    try {
      await wishlistService.addToWishlist(product._id);
      alert("Product added to wishlist!");
    } catch (error) {
      console.error("Add to wishlist error:", error);
      alert(`Failed to add to wishlist: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-16">
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-xl text-gray-600">Loading products...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-16">
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <X className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-xl text-red-600 mb-6">
              Failed to load products: {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-all"
            >
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <span>Home</span>
          <span>/</span>
          <span className="text-gray-900 font-medium">Plants</span>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Plants</h1>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Filter Options
              </h2>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Category
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === "all"}
                      onChange={() => setSelectedCategory("all")}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">
                      All Categories
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === "herbal-powders"}
                      onChange={() => setSelectedCategory("herbal-powders")}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">
                      Herbal Powders
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === "herbal-tablets"}
                      onChange={() => setSelectedCategory("herbal-tablets")}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">
                      Herbal Tablets
                    </span>
                  </label>
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Price
                </h3>
                <div className="text-center mb-3">
                  <span className="text-lg font-bold text-green-600">
                    ₹{priceRange[0]}.00 - ₹{priceRange[1]}.00
                  </span>
                </div>
                <input
                  type="range"
                  min="199"
                  max="499"
                  value={priceRange[1]}
                  onChange={(e) => {
                    const newMax = Number.parseInt(e.target.value);
                    if (newMax >= priceRange[0])
                      setPriceRange([priceRange[0], newMax]);
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* Review Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Review
                </h3>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedRating === rating.toString()}
                        onChange={() =>
                          setSelectedRating(
                            selectedRating === rating.toString()
                              ? "all"
                              : rating.toString()
                          )
                        }
                        className="mr-2"
                      />
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-200"
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-700">
                          {rating} Star
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Filter Bar */}
            <div className="bg-white rounded-lg p-4 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  Showing 1-6 of {filteredProducts.length} results
                </span>

                {/* Active Filters (This section is illustrative and would need dynamic updates) */}
                <div className="flex items-center gap-2">
                  {selectedCategory !== "all" && (
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      Category:{" "}
                      {selectedCategory.charAt(0).toUpperCase() +
                        selectedCategory.slice(1)}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => setSelectedCategory("all")}
                      />
                    </span>
                  )}
                  {priceRange[0] !== 199 ||
                    (priceRange[1] !== 499 && (
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        Price: ₹{priceRange[0]}.00 - ₹{priceRange[1]}.00
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => setPriceRange([199, 499])}
                        />
                      </span>
                    ))}
                  {selectedRating !== "all" && (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      {selectedRating} Star
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => setSelectedRating("all")}
                      />
                    </span>
                  )}
                  {selectedAvailability !== "all" && (
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      {selectedAvailability === "in-stock"
                        ? "In Stock"
                        : "Out of Stock"}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => setSelectedAvailability("all")}
                      />
                    </span>
                  )}
                  {/* Add more active filter indicators as needed */}
                  {(selectedCategory !== "all" ||
                    priceRange[0] !== 199 ||
                    priceRange[1] !== 499 ||
                    selectedRating !== "all" ||
                    selectedAvailability !== "all" ||
                    selectedLightRequirement !== "all" ||
                    selectedPotSize !== "all") && (
                    <button
                      className="text-sm text-gray-600 hover:text-gray-800"
                      onClick={() => {
                        setSelectedCategory("all");
                        setPriceRange([199, 499]);
                        setSelectedRating("all");
                        setSelectedAvailability("all");
                        setSelectedLightRequirement("all");
                        setSelectedPotSize("all");
                      }}
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="Default Sorting">Default Sorting</option>
                    <option value="Price: Low to High">
                      Price: Low to High
                    </option>
                    <option value="Price: High to Low">
                      Price: High to Low
                    </option>
                    <option value="Highest Rated">Highest Rated</option>
                    <option value="Name A-Z">Name A-Z</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  viewMode={viewMode}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                />
              ))}
            </div>

            {/* Pagination */}
            {/* <div className="flex items-center justify-center mt-12">
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <ChevronDown className="w-4 h-4 rotate-90" />
                </button>
                <button className="w-8 h-8 bg-green-600 text-white rounded flex items-center justify-center text-sm font-medium">
                  1
                </button>
                <button className="w-8 h-8 text-gray-600 hover:bg-gray-100 rounded flex items-center justify-center text-sm font-medium">
                  2
                </button>
                <button className="w-8 h-8 text-gray-600 hover:bg-gray-100 rounded flex items-center justify-center text-sm font-medium">
                  3
                </button>
                <span className="text-gray-400">...</span>
                <button className="w-8 h-8 text-gray-600 hover:bg-gray-100 rounded flex items-center justify-center text-sm font-medium">
                  10
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-800">
                  <ChevronDown className="w-4 h-4 -rotate-90" />
                </button>
              </div>
            </div> */}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4 bg-white p-6 rounded-lg">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-yellow-500 rounded"></div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Free Shipping</h3>
              <p className="text-sm text-gray-600">
                Free shipping for order above ₹50
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white p-6 rounded-lg">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-yellow-500 rounded"></div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Flexible Payment</h3>
              <p className="text-sm text-gray-600">
                Multiple secure payment options
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white p-6 rounded-lg">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-yellow-500 rounded"></div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">24×7 Support</h3>
              <p className="text-sm text-gray-600">
                We support online all days.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
