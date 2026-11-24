// Agent Management Service
// Handles agent/department management, availability scheduling, and status updates

class AgentService {
    constructor() {
      this.agents = this.loadAgents()
      this.agentStatusCache = {}
    }
  
    /**
     * Load agents from localStorage
     * @returns {object} Agents data
     */
    loadAgents() {
      try {
        const stored = localStorage.getItem("whatsapp_agents")
        return stored ? JSON.parse(stored) : this.getDefaultAgents()
      } catch (error) {
        console.error("Error loading agents:", error)
        return this.getDefaultAgents()
      }
    }
  
    /**
     * Get default agents configuration
     * @returns {object} Default agents
     */
    getDefaultAgents() {
      return {
        sales: {
          id: "sales",
          name: "Sales Team",
          description: "Product information and bulk orders",
          agents: [
            {
              id: "sales_1",
              name: "Raj Kumar",
              role: "Sales Executive",
              phone: "918010987439",
              email: "raj@healeri.com",
              isActive: true,
              availability: {
                monday: { start: "09:00", end: "18:00" },
                tuesday: { start: "09:00", end: "18:00" },
                wednesday: { start: "09:00", end: "18:00" },
                thursday: { start: "09:00", end: "18:00" },
                friday: { start: "09:00", end: "18:00" },
                saturday: { start: "10:00", end: "16:00" },
                sunday: { start: "10:00", end: "14:00" },
              },
            },
          ],
        },
        support: {
          id: "support",
          name: "Customer Support",
          description: "Order tracking and technical support",
          agents: [
            {
              id: "support_1",
              name: "Priya Singh",
              role: "Support Specialist",
              phone: "918010987439",
              email: "support@healeri.com",
              isActive: true,
              availability: {
                monday: { start: "08:00", end: "20:00" },
                tuesday: { start: "08:00", end: "20:00" },
                wednesday: { start: "08:00", end: "20:00" },
                thursday: { start: "08:00", end: "20:00" },
                friday: { start: "08:00", end: "20:00" },
                saturday: { start: "09:00", end: "18:00" },
                sunday: { start: "09:00", end: "18:00" },
              },
            },
            {
              id: "support_2",
              name: "Amit Patel",
              role: "Support Specialist",
              phone: "918010987439",
              email: "support2@healeri.com",
              isActive: true,
              availability: {
                monday: { start: "10:00", end: "19:00" },
                tuesday: { start: "10:00", end: "19:00" },
                wednesday: { start: "10:00", end: "19:00" },
                thursday: { start: "10:00", end: "19:00" },
                friday: { start: "10:00", end: "19:00" },
                saturday: { start: "11:00", end: "17:00" },
                sunday: null,
              },
            },
          ],
        },
        returns: {
          id: "returns",
          name: "Returns & Refunds",
          description: "Return requests and refund inquiries",
          agents: [
            {
              id: "returns_1",
              name: "Neha Sharma",
              role: "Returns Manager",
              phone: "918010987439",
              email: "returns@healeri.com",
              isActive: true,
              availability: {
                monday: { start: "09:00", end: "17:00" },
                tuesday: { start: "09:00", end: "17:00" },
                wednesday: { start: "09:00", end: "17:00" },
                thursday: { start: "09:00", end: "17:00" },
                friday: { start: "09:00", end: "17:00" },
                saturday: { start: "10:00", end: "15:00" },
                sunday: null,
              },
            },
          ],
        },
      }
    }
  
    /**
     * Get all departments with agents
     * @returns {array} Array of departments
     */
    getAllDepartments() {
      return Object.values(this.agents)
    }
  
    /**
     * Get department by ID
     * @param {string} departmentId - Department ID
     * @returns {object} Department data
     */
    getDepartmentById(departmentId) {
      return this.agents[departmentId] || null
    }
  
    /**
     * Get all agents in a department
     * @param {string} departmentId - Department ID
     * @returns {array} Array of agents
     */
    getAgentsByDepartment(departmentId) {
      const dept = this.getDepartmentById(departmentId)
      return dept ? dept.agents : []
    }
  
    /**
     * Get available agents for a department
     * @param {string} departmentId - Department ID
     * @returns {array} Array of available agents
     */
    getAvailableAgents(departmentId) {
      const agents = this.getAgentsByDepartment(departmentId)
      return agents.filter((agent) => this.isAgentAvailable(agent))
    }
  
    /**
     * Check if an agent is currently available
     * @param {object} agent - Agent object
     * @returns {boolean} True if available
     */
    isAgentAvailable(agent) {
      if (!agent.isActive) return false
  
      const now = new Date()
      const dayName = now.toLocaleDateString("en-US", { weekday: "lowercase" })
      const currentTime = now.toTimeString().slice(0, 5)
  
      const daySchedule = agent.availability[dayName]
      if (!daySchedule) return false
  
      return currentTime >= daySchedule.start && currentTime <= daySchedule.end
    }
  
    /**
     * Get next available agent for a department
     * @param {string} departmentId - Department ID
     * @returns {object} Next available agent or null
     */
    getNextAvailableAgent(departmentId) {
      const agents = this.getAgentsByDepartment(departmentId)
      const available = agents.filter((agent) => this.isAgentAvailable(agent))
  
      if (available.length > 0) {
        return available[0]
      }
  
      // Find next available agent
      for (const agent of agents) {
        if (agent.isActive) {
          return agent
        }
      }
  
      return null
    }
  
    /**
     * Add a new agent to a department
     * @param {string} departmentId - Department ID
     * @param {object} agentData - Agent data
     * @returns {object} Created agent
     */
    addAgent(departmentId, agentData) {
      const dept = this.getDepartmentById(departmentId)
      if (!dept) throw new Error("Department not found")
  
      const newAgent = {
        id: `${departmentId}_${Date.now()}`,
        ...agentData,
        isActive: true,
      }
  
      dept.agents.push(newAgent)
      this.saveAgents()
      return newAgent
    }
  
    /**
     * Update agent information
     * @param {string} departmentId - Department ID
     * @param {string} agentId - Agent ID
     * @param {object} updates - Updates to apply
     * @returns {object} Updated agent
     */
    updateAgent(departmentId, agentId, updates) {
      const dept = this.getDepartmentById(departmentId)
      if (!dept) throw new Error("Department not found")
  
      const agent = dept.agents.find((a) => a.id === agentId)
      if (!agent) throw new Error("Agent not found")
  
      Object.assign(agent, updates)
      this.saveAgents()
      return agent
    }
  
    /**
     * Remove an agent from a department
     * @param {string} departmentId - Department ID
     * @param {string} agentId - Agent ID
     * @returns {boolean} True if removed
     */
    removeAgent(departmentId, agentId) {
      const dept = this.getDepartmentById(departmentId)
      if (!dept) throw new Error("Department not found")
  
      const index = dept.agents.findIndex((a) => a.id === agentId)
      if (index === -1) throw new Error("Agent not found")
  
      dept.agents.splice(index, 1)
      this.saveAgents()
      return true
    }
  
    /**
     * Update agent availability schedule
     * @param {string} departmentId - Department ID
     * @param {string} agentId - Agent ID
     * @param {object} availability - New availability schedule
     * @returns {object} Updated agent
     */
    updateAgentAvailability(departmentId, agentId, availability) {
      return this.updateAgent(departmentId, agentId, { availability })
    }
  
    /**
     * Toggle agent active status
     * @param {string} departmentId - Department ID
     * @param {string} agentId - Agent ID
     * @returns {object} Updated agent
     */
    toggleAgentStatus(departmentId, agentId) {
      const dept = this.getDepartmentById(departmentId)
      if (!dept) throw new Error("Department not found")
  
      const agent = dept.agents.find((a) => a.id === agentId)
      if (!agent) throw new Error("Agent not found")
  
      agent.isActive = !agent.isActive
      this.saveAgents()
      return agent
    }
  
    /**
     * Save agents to localStorage
     */
    saveAgents() {
      try {
        localStorage.setItem("whatsapp_agents", JSON.stringify(this.agents))
      } catch (error) {
        console.error("Error saving agents:", error)
      }
    }
  
    /**
     * Get agent status summary
     * @returns {object} Status summary
     */
    getStatusSummary() {
      const summary = {}
  
      Object.entries(this.agents).forEach(([deptId, dept]) => {
        const available = dept.agents.filter((agent) => this.isAgentAvailable(agent)).length
        const total = dept.agents.filter((agent) => agent.isActive).length
  
        summary[deptId] = {
          departmentName: dept.name,
          available,
          total,
          availabilityPercentage: total > 0 ? Math.round((available / total) * 100) : 0,
        }
      })
  
      return summary
    }
  
    /**
     * Get agent performance metrics
     * @returns {object} Performance metrics
     */
    getPerformanceMetrics() {
      try {
        const events = JSON.parse(localStorage.getItem("whatsapp_events") || "[]")
        const metrics = {}
  
        events.forEach((event) => {
          if (!metrics[event.department]) {
            metrics[event.department] = {
              totalChats: 0,
              uniqueUsers: new Set(),
              lastActivity: null,
            }
          }
  
          metrics[event.department].totalChats++
          metrics[event.department].uniqueUsers.add(event.userAgent)
          metrics[event.department].lastActivity = event.timestamp
        })
  
        // Convert Sets to counts
        Object.keys(metrics).forEach((key) => {
          metrics[key].uniqueUsers = metrics[key].uniqueUsers.size
        })
  
        return metrics
      } catch (error) {
        console.error("Error getting performance metrics:", error)
        return {}
      }
    }
  
    /**
     * Reset to default agents
     */
    resetToDefaults() {
      this.agents = this.getDefaultAgents()
      this.saveAgents()
    }
  }
  
  export default new AgentService()
  