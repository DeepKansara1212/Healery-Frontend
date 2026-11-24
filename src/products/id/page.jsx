"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import productService from "../../services/productService";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import {
  Star,
  Heart,
  Minus,
  Plus,
  Shield,
  Truck,
  RotateCcw,
  Check,
} from "lucide-react";

const PRODUCT_MARKETING_CONTENT = {
  "beetroot powder": {
    descriptionGallery: [
      {
        src: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/426e13e2-9950-4b8f-90da-6834bad88d2f.__CR0,0,600,180_PT0_SX600_V1___.png",
        alt: "Beetroot powder infographic 1",
      },
      {
        src: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/1d447f07-8d2e-4771-bb0e-b37cb60f0ba7.__CR0,0,970,600_PT0_SX970_V1___.png",
        alt: "Beetroot powder infographic 2",
      },
      {
        src: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/97024ccb-3753-41ec-b1ff-161525413ea7.__CR0,0,970,600_PT0_SX970_V1___.png",
        alt: "Beetroot powder infographic 3",
      },
      {
        src: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/421ffd47-baf3-4e45-be61-64cde0769046.__CR0,0,970,600_PT0_SX970_V1___.png",
        alt: "Beetroot powder infographic 4",
      },
      {
        src: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/d8d45e39-2106-45b4-9b52-0614d60329e4.__CR0,0,970,600_PT0_SX970_V1___.png",
        alt: "Beetroot powder infographic 5",
      },
      {
        src: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/a6fe85c3-d79f-45ce-9f53-1b6dbc04d2fc.__CR0,0,970,600_PT0_SX970_V1___.png",
        alt: "Beetroot powder infographic 6",
      },
      {
        src: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/689ebe54-748d-4942-81ef-564116725aea.__CR0,0,970,600_PT0_SX970_V1___.png",
        alt: "Beetroot powder infographic 7",
      },
    ],
    additionalParagraphs: [
      "PURE & NATURAL BEETROOT POWDER – HEALERI brings you premium quality beetroot powder made from carefully dried and finely ground fresh beetroots. This natural powder contains no added sugar, salt, preservatives, or artificial flavouring, making it a clean and wholesome choice for your daily lifestyle.",
      "NUTRIENT-RICH INGREDIENT – A natural source of vitamins, minerals, fibre, folate, potassium, and antioxidants, beetroot powder is a versatile way to enrich your diet. Popular among health-conscious individuals, vegetarians, vegans, and fitness enthusiasts looking for plant-based nutrition.",
      "MULTIPURPOSE USAGE FOR KITCHEN & FITNESS – Add this bright red powder to smoothies, protein shakes, juices, yogurt, soups, salads, sauces, curries, or baking recipes. It works as a natural colouring powder for cakes, desserts, and energy bars, enhancing both taste and appearance without synthetic colours.",
      "DAILY NUTRITION – Convenient and easy to use, beetroot powder helps incorporate the natural goodness of beetroot into your meals. A trending choice for those seeking immunity-boosting ingredients, detox-friendly foods, and everyday clean nutrition.",
      "NATURAL SKIN & HAIR CARE INGREDIENT – Can be used in DIY face packs, scrubs, and hair masks for a natural glow and gentle colouring effect. Beetroot powder is known for adding a soft reddish tint to hair and enhancing skin brightness without chemicals, making it a popular choice in herbal beauty care.",
    ],
  },
  "amla tablets": {
    descriptionGallery: [
      {
        src: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/134246e1-5fc0-471c-8786-d81110380def.__CR0,0,970,600_PT0_SX970_V1___.png",
        alt: "Amla tablets infographic 1",
      },
      {
        src: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/f772c385-470e-4aa2-b3cf-fe5d2921a392.__CR0,0,970,600_PT0_SX970_V1___.png",
        alt: "Amla tablets infographic 2",
      },
      {
        src: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/72341bc9-985d-4ed2-8178-51f3c66f68bf.__CR0,0,970,600_PT0_SX970_V1___.png",
        alt: "Amla tablets infographic 3",
      },
      {
        src: "https://placehold.co/970x600?text=Amla+Tablets+Panel+4https://m.media-amazon.com/images/S/aplus-media-library-service-media/fc2a3fed-ef82-487c-8679-9320180d225e.__CR0,0,970,600_PT0_SX970_V1___.png",
        alt: "Amla tablets infographic 4",
      },
      {
        src: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/063f65f3-4799-4874-bf2b-1d6160b51722.__CR0,0,970,600_PT0_SX970_V1___.png",
        alt: "Amla tablets infographic 5",
      },
      {
        src: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/7e3a22f2-28fa-4617-96c9-3bf0e6df35d1.__CR0,0,970,600_PT0_SX970_V1___.png",
        alt: "Amla tablets infographic 6",
      },
    ],
    additionalParagraphs: [
      "Pure Amla Extract – No Harmful Additives: Healeri ensures quality with every tablet, made using pure Amla extract with no added preservatives, colors, or artificial ingredients. Just natural support in every dose.",
      "Rich in Natural Vitamin C – Support Your Immunity: Healeri Amalaki Tablets are made from pure Amla fruit, which is a natural source of Vitamin C. It helps support your body’s natural defence system, keeping you strong and active throughout the day.",
      "Daily Detox and Body Cleanse Support: Healeri tablets may help remove unwanted toxins from your body. A regular detox helps you feel light and refreshed, supporting your overall wellness and internal balance.",
      "Promotes Healthy Skin and Hair: Healeri Amalaki is packed with natural antioxidants that may support glowing skin and stronger hair. It may help reduce dullness and dryness, making you feel more confident inside and out.",
      "Travel-Friendly Bottle for On-the-Go Use: Healeri helps you stay consistent with your wellness routine even while travelling. Healeri Amalaki Tablets come in a compact, secure bottle that fits easily in your bag or luggage – perfect for a busy lifestyle.",
    ],
  },
  "ashwagandha tablets": {
    descriptionGallery: [
      {
        src: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/b891d670-931c-422d-aedd-016df05eca4c.__CR0,0,970,600_PT0_SX970_V1___.png",
        alt: "Ashwagandha tablets infographic 1",
      },
      {
        src: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/55613f92-055d-45f8-a099-01896e32c211.__CR0,0,970,600_PT0_SX970_V1___.png",
        alt: "Ashwagandha tablets infographic 2",
      },
      {
        src: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/55613f92-055d-45f8-a099-01896e32c211.__CR0,0,970,600_PT0_SX970_V1___.png",
        alt: "Ashwagandha tablets infographic 3",
      },
      {
        src: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/c29e0848-008b-4b55-888e-edf7a25777fa.__CR0,0,970,600_PT0_SX970_V1___.png",
        alt: "Ashwagandha tablets infographic 4",
      },
      {
        src: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/e558b4fd-c9ad-459c-b6dd-162bff686151.__CR0,0,970,600_PT0_SX970_V1___.png",
        alt: "Ashwagandha tablets infographic 5",
      },
      {
        src: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/eb6487b8-a9a1-423e-9e5f-889385320488.__CR0,0,970,600_PT0_SX970_V1___.png",
        alt: "Ashwagandha tablets infographic 6",
      },
    ],
    additionalParagraphs: [
      "Made from Pure Ashwagandha Extract: Healeri Ashwagandha Tablets are made from pure Ashwagandha root extract, known for its natural stress-relief and energy-balancing benefits. This ancient herb supports your mind and body without any harsh additives, helping you stay calm, focused, and refreshed each day.",
      "Reduces Stress & Anxiety: Healeri Ashwagandha Tablets help reduce stress and anxiety by calming your mind and supporting your body’s natural response to pressure. This powerful herb works gently to ease tension, promote relaxation, and help you feel more balanced throughout the day.",
      "Improves Mental Clarity & Focus: Healeri Ashwagandha Tablets support better mental clarity and focus by helping you stay calm and clear-headed. Whether you're working, studying, or managing a busy day, this natural herb helps improve concentration and keeps your mind sharp without feeling overwhelmed.",
      "Strengthens Immunity: Healeri Ashwagandha Tablets help strengthen your immune system by supporting your body’s natural defenses. This powerful herb works from within to keep you feeling healthy, active, and better protected against everyday stress and fatigue.",
      "Travel-Friendly Bottle for On-the-Go Use: Healeri helps you stay consistent with your wellness routine even while travelling. Healeri Ashwagandha Tablets come in a compact, secure bottle that fits easily in your bag or luggage – perfect for a busy lifestyle.",
    ],
  },
  "amla powder": {
    descriptionGallery: [
      {
        src: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/426e13e2-9950-4b8f-90da-6834bad88d2f.__CR0,0,600,180_PT0_SX600_V1___.png",
        alt: "Amla powder infographic 1",
      },
      {
        src: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/33d4bddd-d34c-4654-98ba-da53bc248ac6.__CR0,0,970,600_PT0_SX970_V1___.png",
        alt: "Amla powder infographic 2",
      },
      {
        src: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/2e12fdc4-a25e-48fb-8d96-64c310db3c8d.__CR0,0,970,600_PT0_SX970_V1___.png",
        alt: "Amla powder infographic 3",
      },
      {
        src: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/cfc92962-4fb1-4285-b507-79e84ff72473.__CR0,0,970,600_PT0_SX970_V1___.png",
        alt: "Amla powder infographic 4",
      },
      {
        src: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/6056aca2-f23b-46d1-88a8-434137ca1313.__CR0,0,970,600_PT0_SX970_V1___.png",
        alt: "Amla powder infographic 5",
      },
      {
        src: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/64071944-4aac-4983-ac53-2aa0db87d25d.__CR0,0,970,600_PT0_SX970_V1___.png",
        alt: "Amla powder infographic 6",
      },
      {
        src: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/1c8ef1dc-f93f-489d-a269-4e216e468f6a.__CR0,0,970,600_PT0_SX970_V1___.png",
        alt: "Amla powder infographic 7",
      },
    ],
    additionalParagraphs: [
      "Pure & Natural Amla Powder: HEALERI Amla Powder is pure, free from preservatives, and carefully processed to retain nutrients, ensuring you get the full benefits of this natural for hair, skin, and overall wellness.",
      "Promotes Healthy Hair Growth: HEALERI Regular use of this pure amla powder may help nourish hair follicles, strengthen hair from the roots, reduce hair fall, and enhance natural shine, giving you healthy, smooth, and strong hair naturally.",
      "Boosts Immunity & Energy: HEALERI with essential vitamins and minerals, HEALERI amla Powder helps strengthen the immune system, improves energy levels, and supports overall wellness, keeping your body ready for daily challenges.",
      "Versatile & Easy to Use: HEALERI Amla Powder can be added to smoothies, detox drinks, juices, herbal teas, or meals, offering a simple way to enjoy the health benefits of this every day without any hassle.",
      "Aids Digestion & Detox: HEALERI Amla Powder may help support healthy digestion, promote gut wellness, and assist the body’s natural detoxification process, making it an ideal addition to your daily health routine.",
    ],
  },
  "moringa powder": {
    descriptionGallery: [
      {
        src: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/426e13e2-9950-4b8f-90da-6834bad88d2f.__CR0,0,600,180_PT0_SX600_V1___.png",
        alt: "Moringa powder infographic 1",
      },
      {
        src: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/61f9795b-0352-4ca9-b1d5-4c661837503a.__CR0,0,970,600_PT0_SX970_V1___.png",
        alt: "Moringa powder infographic 2",
      },
      {
        src: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/84735b16-459b-4fa9-a743-4efff6ed3f2d.__CR0,0,970,600_PT0_SX970_V1___.png",
        alt: "Moringa powder infographic 3",
      },
      {
        src: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/ca11e69e-8a48-4b5c-9d39-cb485d28140b.__CR0,0,970,600_PT0_SX970_V1___.png",
        alt: "Moringa powder infographic 4",
      },
      {
        src: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/0d1b440c-a142-4906-a47d-0b7585381707.__CR0,0,970,600_PT0_SX970_V1___.png",
        alt: "Moringa powder infographic 5",
      },
      {
        src: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/bbd8d16f-bec0-4038-b608-5f3b1e2320c0.__CR0,0,970,600_PT0_SX970_V1___.png",
        alt: "Moringa powder infographic 6",
      },
      {
        src: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/7662f8dc-8dca-4973-9b56-ef8081ffeafd.__CR0,0,970,600_PT0_SX970_V1___.png",
        alt: "Moringa powder infographic 6",
      },
    ],
    additionalParagraphs: [
      "Rich in Iron, Vitamins & Antioxidants: HEALERI Moringa Powder is a natural source of essential nutrients like Iron, Vitamin A, B, C and powerful plant-based antioxidants. These nutrients help support immune defence, reduce oxidative stress, and promote sustained energy throughout the day.",
      "Supports Digestion & Gut Health: HEALERI helps Support your immune system and restore daily energy levels with its dense nutritional profile. The combination of vitamins, iron, and antioxidants works together to naturally fight fatigue, enhance stamina, and keep your body strong and active.",
      "Promotes Healthy Skin & Hair: HEALERI supports glowing skin and stronger hair from the inside out. The natural nutrients in moringa help fight dryness, dullness, and breakouts. Regular use may lead to smoother skin, fewer blemishes, and shinier, healthier-looking hair without the need for harsh chemicals or treatments.",
      "Ideal for Weight Management: HEALERI is a great addition to your weight management journey. It helps keep you feeling full for longer, reducing the urge for unhealthy snacking and making it easier to reach and maintain your fitness goals.",
      "How to Store: Store in a cool, dry place away from moisture. Once opened, store in an airtight container.",
    ],
  },
  "triphala tablets": {
    descriptionGallery: [
      {
        src: "https://placehold.co/970x600?text=Triphala+Tablets+Panel+1",
        alt: "Triphala tablets infographic 1",
      },
      {
        src: "https://placehold.co/970x600?text=Triphala+Tablets+Panel+2",
        alt: "Triphala tablets infographic 2",
      },
      {
        src: "https://placehold.co/970x600?text=Triphala+Tablets+Panel+3",
        alt: "Triphala tablets infographic 3",
      },
      {
        src: "https://placehold.co/970x600?text=Triphala+Tablets+Panel+4",
        alt: "Triphala tablets infographic 4",
      },
      {
        src: "https://placehold.co/970x600?text=Triphala+Tablets+Panel+5",
        alt: "Triphala tablets infographic 5",
      },
      {
        src: "https://placehold.co/970x600?text=Triphala+Tablets+Panel+6",
        alt: "Triphala tablets infographic 6",
      },
    ],
    additionalParagraphs: [
      "Natural Digestive Support: Healeri Triphala Tablets are made to support healthy digestion and gut balance. With the power of three herbs, they help your stomach feel light and comfortable every day. A great choice for those dealing with gas, bloating, or acidity.",
      "Made with Amla, Haritaki & Bibhitaki: Each tablet is a blend of three powerful Ayurvedic fruits – Amla for immunity, Haritaki for digestion, and Bibhitaki for detox. Together, they work to keep your digestive system strong and your body cleansed naturally.",
      "Supports Gentle Detox & Body Cleanse: Healeri tablets help remove toxins and waste from the body without causing weakness or discomfort. A natural way to stay clean from the inside out and support overall wellness through daily gentle detox.",
      "Promotes Skin & Eye Health: Healeri Triphala Tablets support clear skin and healthy eyes with Amla, Haritaki, and Bibhitaki. Rich in antioxidants, they help reduce skin dullness, support natural glow, and promote better vision by nourishing from within.",
      "Based on Traditional Ayurvedic Wisdom: Healeri Triphala Tablets Formulated with care using time-tested Ayurvedic knowledge, Healeri Triphala Tablets offer safe, gentle, and effective support for your digestive and overall health needs.",
    ],
  },
};

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [addedToWishlist, setAddedToWishlist] = useState(false);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]); // 添加相关产品状态
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const fetched = await productService.getProductById(id);
        if (cancelled) return;
        const images =
          Array.isArray(fetched?.images) && fetched.images.length > 0
            ? fetched.images
            : [fetched?.bannerImage].filter(Boolean);
        setProduct({ ...fetched, images });
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load product");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    // Load cart and wishlist from localStorage
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setCart(Array.isArray(savedCart) ? savedCart : []);
    setWishlist(Array.isArray(savedWishlist) ? savedWishlist : []);
    if (product?.id || product?._id) {
      const pid = product.id || product._id;
      setIsInWishlist(savedWishlist.some((item) => item.id === pid));
    }
  }, [product?.id, product?._id]);

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const addToCart = () => {
    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const cart = Array.isArray(existingCart) ? existingCart : [];
    const pid = product.id || product._id;
    const existingItem = cart.find((item) => item.id === pid);

    let updatedCart;
    if (existingItem) {
      updatedCart = cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      const newItem = {
        id: pid,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity: quantity,
      };
      updatedCart = [...cart, newItem];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);

    console.log("Product added to cart:", {
      productId: pid,
      quantity: quantity,
    });
  };

  const toggleWishlist = () => {
    // Get existing wishlist from localStorage
    const existingWishlist = JSON.parse(
      localStorage.getItem("wishlist") || "[]"
    );
    const wishlist = Array.isArray(existingWishlist) ? existingWishlist : [];
    const pid = product.id || product._id;
    const existingItem = wishlist.find((item) => item.id === pid);

    if (isInWishlist) {
      // Remove from wishlist
      const updatedWishlist = wishlist.filter((item) => item.id !== pid);
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      window.dispatchEvent(new Event("wishlistUpdated"));
      setIsInWishlist(false);
    } else {
      // Add to wishlist
      if (!existingItem) {
        const newItem = {
          id: pid,
          name: product.name,
          price: product.price,
          image: product.images[0],
        };
        const updatedWishlist = [...wishlist, newItem];
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
        window.dispatchEvent(new Event("wishlistUpdated"));
        setIsInWishlist(true);
        setAddedToWishlist(true);
        setTimeout(() => setAddedToWishlist(false), 2000);
      }
    }

    console.log("Wishlist updated:", {
      productId: pid,
      action: isInWishlist ? "removed" : "added",
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleNavigation = (path) => {
    console.log(`Navigate to: ${path}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading product...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center py-12">
            <p className="text-red-600">Failed to load product</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              Try Again
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Determine stock availability even if backend does not include the virtual `inStock`
  const computedInStock =
    typeof product.inStock === "boolean"
      ? product.inStock
      : (product.stock ?? 0) > 0;

  const normalizedProductName = product?.name?.toLowerCase() || "";
  const marketingKey = Object.keys(PRODUCT_MARKETING_CONTENT).find((key) =>
    normalizedProductName.includes(key)
  );
  const marketingContent = marketingKey
    ? PRODUCT_MARKETING_CONTENT[marketingKey]
    : null;

  const descriptionGallery = marketingContent?.descriptionGallery?.length
    ? marketingContent.descriptionGallery
    : Array.isArray(product.descriptionGallery) &&
      product.descriptionGallery.length > 0
    ? product.descriptionGallery.map((item, index) => ({
        src: item?.src || "/placeholder.svg",
        alt: item?.alt || `${product.name} visual ${index + 1}`,
      }))
    : Array.isArray(product.images) && product.images.length > 0
    ? product.images.map((src, index) => ({
        src: src || "/placeholder.svg",
        alt: `${product.name} visual ${index + 1}`,
      }))
    : [
        {
          src: "/placeholder.svg",
          alt: `${product.name} visual 1`,
        },
      ];

  const marketingAdditionalInfo =
    marketingContent?.additionalParagraphs ?? null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <nav className="mb-8 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate("/")}
              className="hover:text-green-600 transition-colors"
            >
              Home
            </button>
            <span>/</span>
            <button
              onClick={() => navigate("/products")}
              className="hover:text-green-600 transition-colors"
            >
              Plants
            </button>
            <span>/</span>
            <span className="text-gray-900">Product Details</span>
          </div>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-lg overflow-hidden flex items-center justify-center min-h-[400px] lg:min-h-[500px]">
              <img
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-auto max-h-[500px] object-contain"
              />
              {product.badge && (
                <span className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1.5 rounded-full text-xs font-medium z-10">
                  {product.badge}
                </span>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative rounded-lg overflow-hidden bg-gray-50 flex-shrink-0 border-2 ${
                      selectedImage === index
                        ? "border-green-600 ring-2 ring-green-600 ring-offset-2"
                        : "border-transparent hover:border-gray-300 opacity-70 hover:opacity-100"
                    } transition-all duration-200 w-20 h-20 flex items-center justify-center`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-contain p-1"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 uppercase tracking-wide font-medium">
                  {typeof product.category === "string"
                    ? product.category
                    : product.category?.name || "Plant"}
                </span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                  In Stock
                </span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < Math.floor(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-600">
                  {product.rating} ({product.reviews ?? product.numReviews ?? 0}{" "}
                  Reviews)
                </span>
              </div>

              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{product.price}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ₹{product.originalPrice}
                    </span>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                      ${(product.originalPrice - product.price).toFixed(2)} off
                    </span>
                  </>
                )}
              </div>

              <p className="text-gray-600 leading-relaxed mb-6">
                {product.shortDescription || product.description}
              </p>
            </div>

            {/* Quantity & Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={decreaseQuantity}
                    className="p-3 hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-3 font-medium min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    className="p-3 hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={addToCart}
                  disabled={!computedInStock}
                  className="flex-1 bg-green-600 text-white px-8 py-4 font-medium transition-colors duration-200 flex items-center justify-center gap-2 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {addedToCart ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Added</span>
                    </>
                  ) : (
                    <>
                      <span>Add To Cart</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    // Ensure the item is in the cart (single item for buy-now)
                    const existingCart = JSON.parse(
                      localStorage.getItem("cart") || "[]"
                    );
                    const cart = Array.isArray(existingCart)
                      ? existingCart
                      : [];
                    const pid = product.id || product._id;
                    const existingItem = cart.find((item) => item.id === pid);

                    let updatedCart;
                    if (existingItem) {
                      // For buy now, set the selected quantity directly
                      updatedCart = cart.map((item) =>
                        item.id === pid ? { ...item, quantity: quantity } : item
                      );
                    } else {
                      const newItem = {
                        id: pid,
                        name: product.name,
                        price: product.price,
                        image: product.images[0],
                        quantity: quantity,
                      };
                      updatedCart = [...cart, newItem];
                    }

                    localStorage.setItem("cart", JSON.stringify(updatedCart));
                    window.dispatchEvent(new Event("cartUpdated"));
                    navigate("/checkout");
                  }}
                  className="bg-yellow-400 text-gray-900 px-8 py-4 font-medium rounded-lg hover:bg-yellow-500 transition-colors"
                >
                  Buy Now
                </button>
                <button
                  onClick={toggleWishlist}
                  className={`p-4 border transition-colors duration-200 rounded-lg ${
                    isInWishlist
                      ? "border-red-500 bg-red-50 text-red-500"
                      : "border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500"
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${isInWishlist ? "fill-current" : ""}`}
                  />
                </button>
              </div>

              {addedToWishlist && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                  <p className="text-green-800 font-medium">
                    Added to wishlist
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("description")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "description"
                    ? "border-green-600 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("additional")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "additional"
                    ? "border-green-600 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Additional Information
              </button>
              <button
                onClick={() => setActiveTab("review")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "review"
                    ? "border-green-600 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Review
              </button>
            </nav>
          </div>

          <div className="py-8">
            {activeTab === "description" && (
              <div className="space-y-8">
                {descriptionGallery.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm"
                  >
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
            {activeTab === "additional" && (
              <div className="text-gray-600 space-y-6">
                {marketingAdditionalInfo && (
                  <div className="space-y-4">
                    {marketingAdditionalInfo.map((paragraph, index) => (
                      <p key={index} className="leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}
                {product.additionalInformation && (
                  <div className="leading-relaxed whitespace-pre-line">
                    {product.additionalInformation}
                  </div>
                )}
                {(product.fullDescription || product.description) && (
                  <div className="leading-relaxed whitespace-pre-line">
                    {product.fullDescription || product.description}
                  </div>
                )}
                {!marketingAdditionalInfo &&
                  !product.additionalInformation &&
                  !product.fullDescription &&
                  !product.description && (
                    <p>No additional information available for this product.</p>
                  )}
              </div>
            )}
            {activeTab === "review" && (
              <div className="text-gray-600">
                <p>Customer reviews will be displayed here.</p>
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-t border-gray-200">
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="font-medium text-gray-900 mb-1">Free Shipping</div>
            <div className="text-sm text-gray-600">
              Free shipping for order above ₹50
            </div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="font-medium text-gray-900 mb-1">
              Flexible Payment
            </div>
            <div className="text-sm text-gray-600">
              Multiple secure payment options
            </div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <RotateCcw className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="font-medium text-gray-900 mb-1">24x7 Support</div>
            <div className="text-sm text-gray-600">
              We support online all days
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-16 bg-gray-100 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Our Newsletter
          </h3>
          <h4 className="text-3xl font-bold text-gray-900 mb-4">
            Subscribe to Our Newsletter to Get Updates on Our Latest Offers
          </h4>
          <p className="text-gray-600 mb-6">
            Get 25% off on your first order just by subscribing to our
            newsletter
          </p>
          <div className="flex max-w-md mx-auto gap-2">
            <input
              type="email"
              placeholder="Enter Email Address"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <button className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-yellow-500 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
