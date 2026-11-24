"use client"

import { useState, useEffect } from "react"
import { Leaf, ArrowRight, Star, Shield, Truck, Award } from "lucide-react"

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      <div className="hidden"></div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDelay: `${i * 1.5}s`,
            }}
          >
            <div className="w-3 h-3 bg-white/20 rounded-full opacity-40"></div>
          </div>
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div
            className={`space-y-8 transform transition-all duration-1000 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <div className="inline-flex items-center space-x-2 bg-plant-accent/10 px-6 py-3 rounded-full border border-plant-accent/20">
              <div className="w-2 h-2 bg-plant-orange rounded-full animate-pulse"></div>
              <span className="text-plant-accent font-medium text-sm tracking-wide">PREMIUM HERBAL COLLECTION</span>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-plant-primary">
                <span className="block font-light">Bring The Power of Herbs</span>
                <span className="block font-bold mt-2">Close To You</span>
              </h1>
              <p className="text-xl text-plant-secondary leading-relaxed max-w-lg font-light">
              Elevate your wellness with our exclusive herbal collection. Handpicked for purity, health benefits, and natural healing properties - making everyday living healthier and more holistic.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/products"
                className="group btn-plant-primary flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl text-lg px-8 py-4"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-300" />
              </a>
              <a
                href="/about"
                className="group border-2 border-plant-primary/30 text-plant-primary hover:bg-plant-primary/5 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>Learn More</span>
              </a>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8">
              {[
                { value: "100%", label: "Organic", icon: Leaf, color: "#E67E22" },
                { value: "10+", label: "Herbal Product Varieties", icon: Star, color: "#E67E22" },
                { value: "24/7", label: "Herbal Support", icon: Shield, color: "#E67E22" },
              ].map((stat, index) => (
                <div key={index} className="text-left group" style={{ animationDelay: `${index * 200}ms` }}>
                  <div className="flex items-center mb-2">
                    <stat.icon className="w-5 h-5 mr-2 text-plant-orange" />
                    <div className="text-3xl font-bold text-plant-primary">{stat.value}</div>
                  </div>
                  <div className="text-plant-secondary font-medium text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`relative transform transition-all duration-1000 delay-300 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <div className="relative z-10 group">
              <div className="relative overflow-hidden rounded-full w-96 h-96 mx-auto shadow-2xl transform group-hover:scale-[1.02] transition-all duration-500 bg-white border-4 border-plant-primary/10">
                <img
                  src="https://images.unsplash.com/photo-1559108318-39ed452bb6c3?q=80&w=800&auto=format&fit=crop"
                  alt="Beautiful indoor plant in decorative pot"
                  width="400"
                  height="400"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent"></div>
              </div>

              <div className="absolute -top-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-gray-200 animate-float">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-plant-green rounded-xl flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 text-sm">Air Purifying</div>
                    <div className="text-xs text-plant-green">99% Pure Air</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-4 shadow-xl border border-gray-200 animate-float-delay">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-plant-orange rounded-xl flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 text-sm">Premium Quality</div>
                    <div className="text-xs text-plant-orange">Certified Organic</div>
                  </div>
                </div>
              </div>

              <div className="absolute top-1/2 -left-8 bg-white rounded-2xl p-4 shadow-xl border border-gray-200 animate-float">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-plant-green-light rounded-xl flex items-center justify-center">
                    <Truck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 text-sm">Free Delivery</div>
                    <div className="text-xs text-plant-green">Same Day</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(3deg); }
        }
        @keyframes float-delay {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(-3deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float-delay 6s ease-in-out infinite;
          animation-delay: 2s;
        }
      `}</style>
    </section>
  )
}
