"use client"

// WhatsApp Agent Manager Component
// Admin interface for managing agents and departments

import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, ToggleLeft as Toggle2, Mail, Phone, Save, X } from "lucide-react"
import agentService from "../services/agentService"

export default function WhatsAppAgentManager() {
  const [departments, setDepartments] = useState([])
  const [selectedDept, setSelectedDept] = useState(null)
  const [isAddingAgent, setIsAddingAgent] = useState(false)
  const [editingAgent, setEditingAgent] = useState(null)
  const [statusSummary, setStatusSummary] = useState({})
  const [newAgent, setNewAgent] = useState({
    name: "",
    role: "",
    phone: "",
    email: "",
    availability: {
      monday: { start: "09:00", end: "18:00" },
      tuesday: { start: "09:00", end: "18:00" },
      wednesday: { start: "09:00", end: "18:00" },
      thursday: { start: "09:00", end: "18:00" },
      friday: { start: "09:00", end: "18:00" },
      saturday: { start: "10:00", end: "16:00" },
      sunday: null,
    },
  })

  useEffect(() => {
    loadDepartments()
  }, [])

  const loadDepartments = () => {
    const depts = agentService.getAllDepartments()
    setDepartments(depts)
    if (depts.length > 0) {
      setSelectedDept(depts[0].id)
    }
    updateStatusSummary()
  }

  const updateStatusSummary = () => {
    const summary = agentService.getStatusSummary()
    setStatusSummary(summary)
  }

  const handleAddAgent = () => {
    if (!selectedDept || !newAgent.name || !newAgent.phone) {
      alert("Please fill in all required fields")
      return
    }

    try {
      agentService.addAgent(selectedDept, newAgent)
      loadDepartments()
      setNewAgent({
        name: "",
        role: "",
        phone: "",
        email: "",
        availability: {
          monday: { start: "09:00", end: "18:00" },
          tuesday: { start: "09:00", end: "18:00" },
          wednesday: { start: "09:00", end: "18:00" },
          thursday: { start: "09:00", end: "18:00" },
          friday: { start: "09:00", end: "18:00" },
          saturday: { start: "10:00", end: "16:00" },
          sunday: null,
        },
      })
      setIsAddingAgent(false)
    } catch (error) {
      alert(`Error adding agent: ${error.message}`)
    }
  }

  const handleUpdateAgent = () => {
    if (!editingAgent.name || !editingAgent.phone) {
      alert("Please fill in all required fields")
      return
    }

    try {
      agentService.updateAgent(selectedDept, editingAgent.id, editingAgent)
      loadDepartments()
      setEditingAgent(null)
    } catch (error) {
      alert(`Error updating agent: ${error.message}`)
    }
  }

  const handleDeleteAgent = (agentId) => {
    if (window.confirm("Are you sure you want to delete this agent?")) {
      try {
        agentService.removeAgent(selectedDept, agentId)
        loadDepartments()
      } catch (error) {
        alert(`Error deleting agent: ${error.message}`)
      }
    }
  }

  const handleToggleAgent = (agentId) => {
    try {
      agentService.toggleAgentStatus(selectedDept, agentId)
      loadDepartments()
    } catch (error) {
      alert(`Error toggling agent status: ${error.message}`)
    }
  }

  const currentDept = departments.find((d) => d.id === selectedDept)
  const deptStatus = statusSummary[selectedDept]

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">WhatsApp Agent Manager</h2>

      {/* Department Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Department</label>
        <select
          value={selectedDept}
          onChange={(e) => {
            setSelectedDept(e.target.value)
            setEditingAgent(null)
            setIsAddingAgent(false)
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>

      {/* Status Summary */}
      {deptStatus && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-600 font-medium">Total Agents</p>
            <p className="text-2xl font-bold text-blue-900">{deptStatus.total}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-green-600 font-medium">Available Now</p>
            <p className="text-2xl font-bold text-green-900">{deptStatus.available}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm text-purple-600 font-medium">Availability</p>
            <p className="text-2xl font-bold text-purple-900">{deptStatus.availabilityPercentage}%</p>
          </div>
        </div>
      )}

      {/* Add Agent Button */}
      <button
        onClick={() => setIsAddingAgent(!isAddingAgent)}
        className="mb-6 flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add New Agent
      </button>

      {/* Add Agent Form */}
      {isAddingAgent && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Add New Agent</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                value={newAgent.name}
                onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Agent name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <input
                type="text"
                value={newAgent.role}
                onChange={(e) => setNewAgent({ ...newAgent, role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Job title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <input
                type="tel"
                value={newAgent.phone}
                onChange={(e) => setNewAgent({ ...newAgent, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={newAgent.email}
                onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Email address"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddAgent}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <Save className="w-4 h-4" />
              Save Agent
            </button>
            <button
              onClick={() => setIsAddingAgent(false)}
              className="flex items-center gap-2 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Agents List */}
      <div className="space-y-3">
        {currentDept?.agents.map((agent) => (
          <div
            key={agent.id}
            className={`p-4 rounded-lg border ${
              agent.isActive ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"
            }`}
          >
            {editingAgent?.id === agent.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={editingAgent.name}
                    onChange={(e) => setEditingAgent({ ...editingAgent, name: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Name"
                  />
                  <input
                    type="text"
                    value={editingAgent.role}
                    onChange={(e) => setEditingAgent({ ...editingAgent, role: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Role"
                  />
                  <input
                    type="tel"
                    value={editingAgent.phone}
                    onChange={(e) => setEditingAgent({ ...editingAgent, phone: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Phone"
                  />
                  <input
                    type="email"
                    value={editingAgent.email}
                    onChange={(e) => setEditingAgent({ ...editingAgent, email: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Email"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdateAgent}
                    className="flex items-center gap-2 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                  >
                    <Save className="w-3 h-3" />
                    Save
                  </button>
                  <button
                    onClick={() => setEditingAgent(null)}
                    className="flex items-center gap-2 bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400"
                  >
                    <X className="w-3 h-3" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-900">{agent.name}</h4>
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">{agent.role}</span>
                    {agentService.isAgentAvailable(agent) && (
                      <span className="text-xs bg-green-200 text-green-700 px-2 py-1 rounded">Available</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {agent.phone}
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {agent.email}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleAgent(agent.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      agent.isActive
                        ? "bg-green-200 text-green-700 hover:bg-green-300"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    title={agent.isActive ? "Deactivate" : "Activate"}
                  >
                    <Toggle2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEditingAgent(agent)}
                    className="p-2 rounded-lg bg-blue-200 text-blue-700 hover:bg-blue-300 transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteAgent(agent.id)}
                    className="p-2 rounded-lg bg-red-200 text-red-700 hover:bg-red-300 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
