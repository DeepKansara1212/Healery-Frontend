"use client"

// WhatsApp Fallback Options Component
// Provides alternative contact methods when WhatsApp is unavailable

import { useState } from "react"
import { Phone, Mail, MessageSquare, Clock, AlertCircle } from "lucide-react"
import { WHATSAPP_CONFIG } from "../config/whatsapp.config"

export default function WhatsAppFallbackOptions({ showTitle = true, compact = false }) {
  const [selectedMethod, setSelectedMethod] = useState(null)
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fallback = WHATSAPP_CONFIG.fallback

  const handleEmailClick = () => {
    const subject = "Support Request from Healeri"
    const body = `Hello,\n\n${message || "I need assistance with my inquiry."}\n\nThank you`
    window.location.href = `mailto:${fallback.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const handlePhoneClick = () => {
    window.location.href = `tel:${fallback.phoneNumber}`
  }

  const handleContactFormSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Store message in localStorage for reference
      const messages = JSON.parse(localStorage.getItem("fallback_messages") || "[]")
      messages.push({
        timestamp: new Date().toISOString(),
        message,
        method: "contact_form",
      })
      localStorage.setItem("fallback_messages", JSON.stringify(messages))

      alert("Thank you! We've received your message and will get back to you soon.")
      setMessage("")
      setSelectedMethod(null)
    } catch (error) {
      alert("Error submitting message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (compact) {
    return (
      <div className="space-y-2">
        {fallback.enablePhoneCall && (
          <a
            href={`tel:${fallback.phoneNumber}`}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>{fallback.phoneNumber}</span>
          </a>
        )}
        {fallback.enableEmail && (
          <a
            href={`mailto:${fallback.email}`}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span>{fallback.email}</span>
          </a>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      {showTitle && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            Alternative Contact Methods
          </h3>
          <p className="text-sm text-gray-600">If WhatsApp is unavailable, you can reach us through these channels</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Phone Call Option */}
        {fallback.enablePhoneCall && (
          <button
            onClick={() => setSelectedMethod("phone")}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedMethod === "phone"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 hover:border-blue-300 bg-white"
            }`}
          >
            <Phone className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900 mb-1">Call Us</h4>
            <p className="text-sm text-gray-600 mb-2">{fallback.phoneNumber}</p>
            <p className="text-xs text-gray-500">Available 24/7</p>
          </button>
        )}

        {/* Email Option */}
        {fallback.enableEmail && (
          <button
            onClick={() => setSelectedMethod("email")}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedMethod === "email"
                ? "border-green-600 bg-green-50"
                : "border-gray-200 hover:border-green-300 bg-white"
            }`}
          >
            <Mail className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900 mb-1">Email Us</h4>
            <p className="text-sm text-gray-600 mb-2">{fallback.email}</p>
            <p className="text-xs text-gray-500">Response within 24 hours</p>
          </button>
        )}

        {/* Contact Form Option */}
        {fallback.enableContactForm && (
          <button
            onClick={() => setSelectedMethod("form")}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedMethod === "form"
                ? "border-purple-600 bg-purple-50"
                : "border-gray-200 hover:border-purple-300 bg-white"
            }`}
          >
            <MessageSquare className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900 mb-1">Contact Form</h4>
            <p className="text-sm text-gray-600 mb-2">Send us a message</p>
            <p className="text-xs text-gray-500">We'll respond soon</p>
          </button>
        )}
      </div>

      {/* Selected Method Details */}
      {selectedMethod === "phone" && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 mb-2">Call Our Support Team</h4>
              <p className="text-sm text-blue-800 mb-3">
                Our team is available to assist you with any questions or concerns.
              </p>
              <button
                onClick={handlePhoneClick}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Call Now
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedMethod === "email" && (
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-semibold text-green-900 mb-2">Send Us an Email</h4>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your inquiry..."
                className="w-full px-3 py-2 border border-green-300 rounded-lg mb-3 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows="3"
              />
              <button
                onClick={handleEmailClick}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Send Email
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedMethod === "form" && (
        <form onSubmit={handleContactFormSubmit} className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="flex items-start gap-3 mb-4">
            <MessageSquare className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-semibold text-purple-900 mb-3">Send us a Message</h4>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us how we can help..."
                className="w-full px-3 py-2 border border-purple-300 rounded-lg mb-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows="4"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Submit Message"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Response Time Info */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-start gap-2">
          <Clock className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-gray-600">
            <p className="font-medium text-gray-900 mb-1">Expected Response Times:</p>
            <ul className="space-y-1 text-xs">
              <li>WhatsApp: Immediate (when available)</li>
              <li>Phone: Immediate during business hours</li>
              <li>Email: Within 24 hours</li>
              <li>Contact Form: Within 24-48 hours</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
