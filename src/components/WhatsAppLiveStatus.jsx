"use client"

// WhatsApp Live Status Component
// Displays live agent availability with real-time updates

import { useState, useEffect } from "react"
import { Users, Clock } from "lucide-react"
import agentService from "../services/agentService"

export default function WhatsAppLiveStatus({ departmentId = "sales" }) {
  const [agents, setAgents] = useState([])
  const [availableCount, setAvailableCount] = useState(0)

  useEffect(() => {
    updateAgents()
    const interval = setInterval(updateAgents, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [departmentId])

  const updateAgents = () => {
    const deptAgents = agentService.getAgentsByDepartment(departmentId)
    setAgents(deptAgents)

    const available = deptAgents.filter((agent) => agentService.isAgentAvailable(agent)).length
    setAvailableCount(available)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Users className="w-4 h-4 text-green-600" />
          Live Agents
        </h3>
        <span className="text-sm font-medium text-gray-600">
          {availableCount} of {agents.length} available
        </span>
      </div>

      <div className="space-y-2">
        {agents.map((agent) => {
          const isAvailable = agentService.isAgentAvailable(agent)
          return (
            <div
              key={agent.id}
              className={`p-3 rounded-lg border transition-colors ${
                isAvailable ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${isAvailable ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
                  />
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{agent.name}</p>
                    <p className="text-xs text-gray-600">{agent.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  {isAvailable ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded">
                      <Clock className="w-3 h-3" />
                      Available
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      <Clock className="w-3 h-3" />
                      Offline
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {agents.length === 0 && (
        <div className="text-center py-6">
          <p className="text-gray-600 text-sm">No agents available for this department</p>
        </div>
      )}
    </div>
  )
}
