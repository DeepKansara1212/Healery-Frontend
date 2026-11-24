"use client"

import Header from "../components/Header"
import Footer from "../components/Footer"
import { useState } from "react"
import inquiryService from "../services/inquiryService"
import WhatsAppInlineButton from "../components/WhatsAppInlineButton"
import { WHATSAPP_CONFIG } from "../config/whatsapp.config"

export default function BulkOrder() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    product: "",
    quantity: 10,
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: name === "quantity" ? Number(value) : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccess("")
    setError("")
    try {
      await inquiryService.submit(form)
      setSuccess("Thank you! Our sales manager will contact you shortly.")
      setForm({ name: "", email: "", phone: "", company: "", product: "", quantity: 10, message: "" })
    } catch (err) {
      setError(err.message || "Failed to submit inquiry. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-plant-cream">
      <Header />
      <main className="container mx-auto px-4 py-10">
        <section className="text-center mb-12">
          <h1 className="text-5xl font-light text-plant-primary mb-6">Bulk Order</h1>
          <p className="text-xl text-plant-secondary mb-2">Bulk order should be above 10 units.</p>
          <p className="text-lg text-plant-secondary">
            For bulk orders, please contact our sales manager at{" "}
            <a className="text-plant-accent font-semibold hover:underline" href="tel:8010987439">
              8010987439
            </a>{" "}
            or via{" "}
            <a
              className="text-plant-accent font-semibold hover:underline"
              href={`https://wa.me/${WHATSAPP_CONFIG.primaryNumber}`}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
            .
          </p>
          <div className="mt-6">
            <WhatsAppInlineButton
              departmentId="sales"
              message={WHATSAPP_CONFIG.messageTemplates.bulkOrder}
              variant="secondary"
              size="md"
              showIcon={true}
              showLabel={true}
            />
          </div>
        </section>

        <section className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-plant-light/20 p-8">
          <h2 className="text-2xl text-center font-semibold text-plant-primary mb-6">Send an Inquiry</h2>
          {success && (
            <div className="mb-4 p-4 rounded-lg bg-plant-accent/10 border border-plant-accent/20 text-plant-accent">
              {success}
            </div>
          )}
          {error && <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 text-red-600">{error}</div>}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-plant-secondary mb-2">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border border-plant-light/30 rounded-lg p-3 bg-white focus:ring-2 focus:ring-plant-accent focus:border-plant-accent transition-colors"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-plant-secondary mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border border-plant-light/30 rounded-lg p-3 bg-white focus:ring-2 focus:ring-plant-accent focus:border-plant-accent transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-plant-secondary mb-2">Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full border border-plant-light/30 rounded-lg p-3 bg-white focus:ring-2 focus:ring-plant-accent focus:border-plant-accent transition-colors"
                placeholder="Phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-plant-secondary mb-2">Company (optional)</label>
              <input
                name="company"
                value={form.company}
                onChange={handleChange}
                className="w-full border border-plant-light/30 rounded-lg p-3 bg-white focus:ring-2 focus:ring-plant-accent focus:border-plant-accent transition-colors"
                placeholder="Company name"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-plant-secondary mb-2">Product</label>
              <input
                name="product"
                value={form.product}
                onChange={handleChange}
                required
                className="w-full border border-plant-light/30 rounded-lg p-3 bg-white focus:ring-2 focus:ring-plant-accent focus:border-plant-accent transition-colors"
                placeholder="Interested product(s)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-plant-secondary mb-2">Quantity</label>
              <input
                type="number"
                min={10}
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                required
                className="w-full border border-plant-light/30 rounded-lg p-3 bg-white focus:ring-2 focus:ring-plant-accent focus:border-plant-accent transition-colors"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-plant-secondary mb-2">Message</label>
              <textarea
                name="message"
                rows={4}
                value={form.message}
                onChange={handleChange}
                className="w-full border border-plant-light/30 rounded-lg p-3 bg-white focus:ring-2 focus:ring-plant-accent focus:border-plant-accent transition-colors"
                placeholder="Tell us about your requirements"
              ></textarea>
            </div>
            <div className="md:col-span-2">
              <button
                disabled={loading}
                className="w-full bg-plant-accent hover:bg-plant-accent/90 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? "Sending..." : "Submit Inquiry"}
              </button>
            </div>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  )
}
