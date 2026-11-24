"use client"

// WhatsApp Button Component
// Floating action button for WhatsApp communication with department selection

import { useState, useEffect } from "react"
import { MessageCircle, X, Clock, Phone, Mail } from "lucide-react"
import whatsappService from "../services/whatsappService"
import { WHATSAPP_CONFIG, getAllDepartments } from "../config/whatsapp.config"

export default function WhatsAppButton({ defaultDepartment = "sales", position = "bottom-right" }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState(defaultDepartment)
  const [departmentStatus, setDepartmentStatus] = useState({})
  const [nextAvailableTime, setNextAvailableTime] = useState("")

  useEffect(() => {
    // Update department status on mount and every minute
    const updateStatus = () => {
      const status = whatsappService.getAllDepartmentStatus()
      setDepartmentStatus(status)

      const nextTime = whatsappService.getNextAvailableTime(selectedDepartment)
      setNextAvailableTime(nextTime)
    }

    updateStatus()
    const interval = setInterval(updateStatus, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [selectedDepartment])

  const handleWhatsAppClick = (departmentId) => {
    whatsappService.trackWhatsAppClick(departmentId, "floating_button")
    const url = whatsappService.getWhatsAppLink(departmentId, WHATSAPP_CONFIG.messageTemplates.general)
    window.open(url, "_blank")
    setIsOpen(false)
  }

  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "top-right": "top-6 right-6",
    "top-left": "top-6 left-6",
  }

  const isAvailable = departmentStatus[selectedDepartment]

  return (
    <div className={`fixed ${positionClasses[position]} z-40`}>
      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center ${
          isAvailable ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 hover:bg-gray-500"
        } text-white`}
        title={isAvailable ? "Chat with us on WhatsApp" : "We're currently offline"}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Expanded Menu */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4">
            <h3 className="font-semibold text-lg mb-1">How can we help?</h3>
            <p className="text-sm text-green-100">Choose a department to chat with us</p>
          </div>

          {/* Department List */}
          <div className="max-h-96 overflow-y-auto">
            {getAllDepartments().map((dept) => {
              const isAvailable = departmentStatus[dept.id]
              return (
                <button
                  key={dept.id}
                  onClick={() => handleWhatsAppClick(dept.id)}
                  className="w-full px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{dept.name}</h4>
                        <span
                          className={`inline-block w-2 h-2 rounded-full ${
                            isAvailable ? "bg-green-500" : "bg-gray-400"
                          }`}
                        />
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{dept.description}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{isAvailable ? "Available now" : whatsappService.getNextAvailableTime(dept.id)}</span>
                      </div>
                    </div>
                    <div className="ml-2 text-green-600">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Footer with Fallback Options */}
          <div className="bg-gray-50 border-t border-gray-200 p-4">
            <p className="text-xs text-gray-600 mb-3 font-medium">Other ways to reach us:</p>
            <div className="space-y-2">
              {WHATSAPP_CONFIG.fallback.enablePhoneCall && (
                <a
                  href={`tel:${WHATSAPP_CONFIG.fallback.phoneNumber}`}
                  className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>{WHATSAPP_CONFIG.fallback.phoneNumber}</span>
                </a>
              )}
              {WHATSAPP_CONFIG.fallback.enableEmail && (
                <a
                  href={`mailto:${WHATSAPP_CONFIG.fallback.email}`}
                  className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>{WHATSAPP_CONFIG.fallback.email}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
