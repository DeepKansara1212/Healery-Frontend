"use client"

// WhatsApp Inline Button Component
// Inline button for embedding in pages with customizable styling

import { MessageCircle, Clock } from "lucide-react"
import whatsappService from "../services/whatsappService"
import { WHATSAPP_CONFIG } from "../config/whatsapp.config"
import { useState, useEffect } from "react"

export default function WhatsAppInlineButton({
  departmentId = "sales",
  message = "",
  variant = "primary", // 'primary', 'secondary', 'outline', 'ghost'
  size = "md", // 'sm', 'md', 'lg'
  showIcon = true,
  showLabel = true,
  showStatus = true,
  className = "",
  onClick = null,
}) {
  const [isAvailable, setIsAvailable] = useState(false)
  const [nextAvailableTime, setNextAvailableTime] = useState("")

  useEffect(() => {
    const updateStatus = () => {
      setIsAvailable(whatsappService.isDepartmentAvailable(departmentId))
      setNextAvailableTime(whatsappService.getNextAvailableTime(departmentId))
    }

    updateStatus()
    const interval = setInterval(updateStatus, 60000)
    return () => clearInterval(interval)
  }, [departmentId])

  const handleClick = () => {
    whatsappService.trackWhatsAppClick(departmentId, "inline_button")

    if (onClick) {
      onClick()
      return
    }

    const url = message
      ? whatsappService.getWhatsAppLink(departmentId, message)
      : whatsappService.getWhatsAppLink(departmentId, WHATSAPP_CONFIG.messageTemplates.general)

    window.open(url, "_blank")
  }

  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-3 text-lg",
  }

  const variantClasses = {
    primary: "bg-green-600 hover:bg-green-700 text-white",
    secondary: "bg-green-100 hover:bg-green-200 text-green-700",
    outline: "border-2 border-green-600 text-green-600 hover:bg-green-50",
    ghost: "text-green-600 hover:bg-green-50",
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleClick}
        className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 ${sizeClasses[size]} ${variantClasses[variant]} ${className} ${
          !isAvailable && variant !== "ghost" ? "opacity-75" : ""
        }`}
        title={isAvailable ? "Chat with us on WhatsApp" : `We're offline. ${nextAvailableTime}`}
      >
        {showIcon && <MessageCircle className="w-5 h-5" />}
        {showLabel && <span>Chat on WhatsApp</span>}
        {!isAvailable && showStatus && <span className="inline-block w-2 h-2 rounded-full bg-gray-400 ml-1" />}
      </button>

      {showStatus && !isAvailable && (
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <Clock className="w-3 h-3" />
          <span>{nextAvailableTime}</span>
        </div>
      )}
    </div>
  )
}
