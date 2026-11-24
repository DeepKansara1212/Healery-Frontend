"use client"

// WhatsApp Availability Widget Component
// Real-time availability status display with live updates

import { useState, useEffect } from "react"
import { Clock, CheckCircle, AlertCircle, RefreshCw } from "lucide-react"
import agentService from "../services/agentService"

export default function WhatsAppAvailabilityWidget({ compact = false }) {
  const [statusSummary, setStatusSummary] = useState({})
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  useEffect(() => {
    updateStatus()
    const interval = setInterval(updateStatus, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  const updateStatus = () => {
    setIsRefreshing(true)
    const summary = agentService.getStatusSummary()
    setStatusSummary(summary)
    setLastUpdated(new Date())
    setIsRefreshing(false)
  }

  const getOverallStatus = () => {
    const statuses = Object.values(statusSummary)
    const totalAvailable = statuses.reduce((sum, s) => sum + s.available, 0)
    const totalAgents = statuses.reduce((sum, s) => sum + s.total, 0)

    if (totalAvailable === 0) return "offline"
    if (totalAvailable < totalAgents / 2) return "busy"
    return "online"
  }

  const overallStatus = getOverallStatus()

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div
          className={`w-3 h-3 rounded-full animate-pulse ${
            overallStatus === "online" ? "bg-green-500" : overallStatus === "busy" ? "bg-yellow-500" : "bg-gray-400"
          }`}
        />
        <span className="text-sm font-medium text-gray-700">
          {overallStatus === "online" ? "We're Online" : overallStatus === "busy" ? "We're Busy" : "We're Offline"}
        </span>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Support Availability</h3>
        <button
          onClick={updateStatus}
          disabled={isRefreshing}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          title="Refresh status"
        >
          <RefreshCw className={`w-4 h-4 text-gray-600 ${isRefreshing ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Overall Status */}
      <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-green-50 to-blue-50 border border-green-200">
        <div className="flex items-center gap-3 mb-2">
          {overallStatus === "online" ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : overallStatus === "busy" ? (
            <AlertCircle className="w-5 h-5 text-yellow-600" />
          ) : (
            <Clock className="w-5 h-5 text-gray-600" />
          )}
          <span className="font-semibold text-gray-900">
            {overallStatus === "online"
              ? "We're Online & Ready to Help"
              : overallStatus === "busy"
                ? "We're Busy But Available"
                : "We're Currently Offline"}
          </span>
        </div>
        <p className="text-sm text-gray-600">
          Last updated: {lastUpdated.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>

      {/* Department Status */}
      <div className="space-y-3">
        {Object.entries(statusSummary).map(([deptId, status]) => (
          <div key={deptId} className="p-3 rounded-lg border border-gray-200 hover:border-green-300 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">{status.departmentName}</h4>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${status.available > 0 ? "bg-green-500" : "bg-gray-400"}`} />
                <span className="text-sm font-medium text-gray-700">
                  {status.available}/{status.total} Available
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${status.available > 0 ? "bg-green-500" : "bg-gray-400"}`}
                style={{ width: `${status.availabilityPercentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">{status.availabilityPercentage}% availability</p>
          </div>
        ))}
      </div>

      {/* Next Available Info */}
      <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-900">
          <span className="font-medium">Tip:</span> If we're offline, leave a message and we'll get back to you as soon
          as possible.
        </p>
      </div>
    </div>
  )
}
