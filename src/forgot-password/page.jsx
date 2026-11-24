"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Mail, ArrowRight, Shield, CheckCircle } from "lucide-react"
import Header from "../components/Header"
import authService from "../services/authService"

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await authService.forgotPassword(email.trim().toLowerCase())
      setIsSubmitted(true)
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignIn = () => {
    navigate("/signin")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <Header />

      <main className="container mx-auto container-padding py-20">
        <div className="max-w-lg mx-auto">
          <div className="glass rounded-3xl shadow-2xl border border-border/30 overflow-hidden">
            <div className="bg-gradient-to-br from-accent to-primary p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 backdrop-blur-sm"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 glass rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Shield className="w-10 h-10 text-accent" />
                </div>
                <h1 className="heading-lg text-primary-foreground mb-3">Reset Password</h1>
                <p className="text-primary-foreground/80 text-lg">We'll help you get back to wellness</p>
              </div>
            </div>

            <div className="p-12">
              {isSubmitted ? (
                <div className="text-center space-y-8">
                  <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto">
                    <CheckCircle className="w-10 h-10 text-primary" />
                  </div>
                  <div className="space-y-4">
                    <h2 className="heading-md text-foreground">Check Your Email</h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      If an account exists for <span className="font-bold text-primary">{email}</span>, we've sent
                      password reset instructions.
                    </p>
                  </div>
                  <div className="glass rounded-2xl p-6 border border-border/30">
                    <p className="text-muted-foreground">
                      Don't see it? Check your spam folder or{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setIsSubmitted(false)
                          setEmail("")
                        }}
                        className="text-primary hover:text-secondary transition-colors duration-300 font-bold"
                      >
                        try again
                      </button>
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-6 mb-8">
                      <p className="text-destructive font-medium">{error}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-3">
                      <label htmlFor="email" className="block font-bold text-foreground">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          type="email"
                          id="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 border border-border/30 rounded-2xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 bg-background/50 text-foreground placeholder:text-muted-foreground font-medium"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full btn-primary py-4 px-6 rounded-2xl font-bold text-lg flex items-center justify-center space-x-2 focus-ring"
                    >
                      {isLoading ? (
                        <div className="w-6 h-6 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <span>Send Reset Link</span>
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>

                    <div className="text-center pt-6 border-t border-border/30">
                      <p className="text-muted-foreground text-lg">
                        Remember your password?{" "}
                        <button
                          type="button"
                          onClick={handleSignIn}
                          className="text-primary hover:text-secondary transition-colors duration-300 font-bold"
                        >
                          Sign In
                        </button>
                      </p>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
