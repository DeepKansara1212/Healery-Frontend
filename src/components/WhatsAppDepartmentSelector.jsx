"use client"

// WhatsApp Department Selector Component
// Modal/dropdown for selecting department and initiating chat

import { useState, useEffect } from "react"
import { X, MessageCircle, Clock, CheckCircle } from "lucide-react"
import whatsappService from "../services/whatsappService"
import { getAllDepartments } from "../config/whatsapp.config"

export default function WhatsAppDepartmentSelector({ isOpen, onClose, onSelect }) {
  const [selectedDept, setSelectedDept] = useState(null)
  const [departmentStatus, setDepartmentStatus] = useState({})
  const [customMessage, setCustomMessage] = useState("")

  useEffect(() => {
    const updateStatus = () => {
      const status = whatsappService.getAllDepartmentStatus()
      setDepartmentStatus(status)
    }

    updateStatus()
    const interval = setInterval(updateStatus, 60000)
    return () => clearInterval(interval)
  }, [])

  const handleSendMessage = () => {
    if (!selectedDept) return

    whatsappService.trackWhatsAppClick(selectedDept.id, "department_selector")

    const message = customMessage || `Hi! I would like to know more about ${selectedDept.name}.`
    const url = whatsappService.getWhatsAppLink(selectedDept.id, message)

    window.open(url, "_blank")

    if (onSelect) onSelect(selectedDept)
    setCustomMessage("")
    setSelectedDept(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-96 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Contact Us on WhatsApp</h2>
            <p className="text-sm text-green-100 mt-1">Select a department to get started</p>
          </div>
          <button onClick={onClose} className="text-white hover:bg-green-700 rounded-full p-1 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Department List */}
        <div className="overflow-y-auto max-h-64">
          {getAllDepartments().map((dept) => {
            const isAvailable = departmentStatus[dept.id]
            const isSelected = selectedDept?.id === dept.id

            return (
              <button
                key={dept.id}
                onClick={() => setSelectedDept(dept)}
                className={`w-full px-6 py-4 border-b border-gray-100 text-left transition-colors ${
                  isSelected ? "bg-green-50" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{dept.name}</h3>
                      {isAvailable && <CheckCircle className="w-4 h-4 text-green-600" />}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{dept.description}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{isAvailable ? "Available now" : whatsappService.getNextAvailableTime(dept.id)}</span>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="ml-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Message Input */}
        {selectedDept && (
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <label className="block text-sm font-medium text-gray-700 mb-2">Add a message (optional)</label>
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Type your message here..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              rows="3"
            />
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-white flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSendMessage}
            disabled={!selectedDept}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Send Message
          </button>
        </div>
      </div>
    </div>
  )
}
