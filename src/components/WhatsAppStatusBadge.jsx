"use client"

// WhatsApp Status Badge Component
// Shows availability status for a department

import { Clock, CheckCircle } from "lucide-react"
import whatsappService from "../services/whatsappService"
import { useState, useEffect } from "react"

export default function WhatsAppStatusBadge({ departmentId = "sales", showLabel = true }) {
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

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
        isAvailable ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
      }`}
      title={nextAvailableTime}
    >
      {isAvailable ? (
        <>
          <CheckCircle className="w-4 h-4" />
          {showLabel && <span>Available Now</span>}
        </>
      ) : (
        <>
          <Clock className="w-4 h-4" />
          {showLabel && <span>{nextAvailableTime}</span>}
        </>
      )}
    </div>
  )
}
