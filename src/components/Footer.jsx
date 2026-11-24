"use client"

import { useState } from "react"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Leaf } from "lucide-react"

export default function Footer() {
  const [email, setEmail] = useState("")
  const [isSubscribing, setIsSubscribing] = useState(false)
  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsSubscribing(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubscribing(false)
    setEmail("")
  }

  return (
    <>
      <section className="bg-plant-light py-16 bg-leaf-pattern">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-sm font-medium text-plant-gray mb-2">Our Newsletter</h2>
          <h3 className="text-3xl font-bold text-plant-black mb-4">Subscribe to Our Newsletter to</h3>
          <h3 className="text-3xl font-bold text-plant-green mb-6">Get Updates on Our Latest Offers</h3>
          <p className="text-plant-gray mb-8">Get 25% off on your first order just by subscribing to our newsletter</p>

          <form onSubmit={handleSubscribe} className="flex max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-plant-green focus:border-transparent"
            />
            <button
              type="submit"
              disabled={isSubscribing}
              className="bg-plant-yellow hover:bg-yellow-500 text-plant-black px-6 py-3 rounded-r-lg font-medium transition-colors duration-200 disabled:opacity-50"
            >
              {isSubscribing ? "..." : "Subscribe"}
            </button>
          </form>
        </div>
      </section>

      <footer className="bg-plant-dark text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-plant-yellow rounded-full flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-plant-dark" />
                </div>
                <span className="text-xl font-bold">Plant Shop.</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna.
              </p>
              <div className="flex space-x-3">
                {[Facebook, Instagram, Twitter, Mail, Phone].map((Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="w-8 h-8 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors duration-200"
                  >
                    <Icon className="w-4 h-4 text-plant-dark" />
                  </a>
                ))}
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Company</h3>
              <ul className="space-y-3">
                {[
                  { href: "/about", label: "About Us" },
                  { href: "/contact", label: "Blog" },
                  { href: "/contact", label: "Contact Us" },
                  { href: "/careers", label: "Career" },
                ].map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Services */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Customer Services</h3>
              <ul className="space-y-3">
                {[
                  { href: "/profile", label: "My Account" },
                  { href: "/orders", label: "Track Your Order" },
                  { href: "/returns", label: "Return" },
                  { href: "/faq", label: "FAQ" },
                ].map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Our Information */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Our Information</h3>
              <ul className="space-y-3">
                {[
                  { href: "/privacy", label: "Privacy" },
                  { href: "/terms", label: "User Terms & Condition" },
                  { href: "/returns", label: "Return Policy" },
                ].map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Contact Info</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Phone className="w-4 h-4 text-green-200 mt-0.5" />
                  <span className="text-green-100 text-sm">+0123-456-789</span>
                </div>
                <div className="flex items-start space-x-3">
                  <Mail className="w-4 h-4 text-green-200 mt-0.5" />
                  <span className="text-green-100 text-sm">example@gmail.com</span>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-green-200 mt-0.5" />
                  <span className="text-green-100 text-sm">8502 Preston Rd. Inglewood, Maine 98380</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-600 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              Copyright © 2024{" "}
              <a href="/" className="text-plant-yellow hover:text-yellow-300">
                Plant Shop Website
              </a>
              . All Rights Reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <select className="bg-transparent border border-gray-600 text-gray-300 px-3 py-1 rounded text-sm">
                <option value="en">English</option>
              </select>
              <select className="bg-transparent border border-gray-600 text-gray-300 px-3 py-1 rounded text-sm">
                <option value="usd">USD</option>
              </select>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
