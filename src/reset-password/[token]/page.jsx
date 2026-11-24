"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Lock, Eye, EyeOff, CheckCircle, ArrowRight, Key } from "lucide-react"
import Header from "../../components/Header"
import authService from "../../services/authService"

export default function ResetPasswordPage() {
  const { token } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  // Check token validity
  useEffect(() => {
    if (!token) {
      setError("Invalid password reset link")
    }
  }, [token])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (name === "password") {
      // Calculate password strength
      let strength = 0
      if (value.length >= 8) strength += 1
      if (/[A-Z]/.test(value)) strength += 1
      if (/[a-z]/.test(value)) strength += 1
      if (/[0-9]/.test(value)) strength += 1
      if (/[^A-Za-z0-9]/.test(value)) strength += 1
      setPasswordStrength(strength)
    }
  }

  const validateForm = () => {
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      return false
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      setError("Password must contain at least one uppercase letter, one lowercase letter, and one number")
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!validateForm()) {
      setIsLoading(false)
      return
    }

    try {
      const response = await authService.resetPassword(token, formData.password)
      if (response.success) {
        setIsSuccess(true)
      } else {
        setError(response.message || "Password reset failed")
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignIn = () => {
    navigate("/signin")
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return "bg-destructive"
    if (passwordStrength <= 2) return "bg-secondary"
    if (passwordStrength <= 3) return "bg-accent"
    if (passwordStrength <= 4) return "bg-primary"
    return "bg-primary"
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return "Very Weak"
    if (passwordStrength <= 2) return "Weak"
    if (passwordStrength <= 3) return "Medium"
    if (passwordStrength <= 4) return "Strong"
    return "Very Strong"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <Header />

      <main className="container mx-auto container-padding py-20">
        <div className="max-w-lg mx-auto">
          <div className="glass rounded-3xl shadow-2xl border border-border/30 overflow-hidden">
            <div className="bg-gradient-to-br from-primary to-accent p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 glass rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Key className="w-10 h-10 text-primary" />
                </div>
                <h1 className="heading-lg text-primary-foreground mb-3">New Password</h1>
                <p className="text-primary-foreground/80 text-lg">Create a secure password</p>
              </div>
            </div>

            <div className="p-12">
              {isSuccess ? (
                <div className="text-center space-y-8">
                  <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto">
                    <CheckCircle className="w-10 h-10 text-primary" />
                  </div>
                  <div className="space-y-4">
                    <h2 className="heading-md text-foreground">Password Reset Successful</h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      Your password has been reset successfully. You can now sign in with your new password.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSignIn}
                    className="w-full btn-primary py-4 px-6 rounded-2xl font-bold text-lg flex items-center justify-center space-x-2 focus-ring"
                  >
                    <span>Sign In</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-6 mb-8">
                      <p className="text-destructive font-medium">{error}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Password */}
                    <div className="space-y-3">
                      <label htmlFor="password" className="block font-bold text-foreground">
                        New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          name="password"
                          required
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full pl-12 pr-14 py-4 border border-border/30 rounded-2xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 bg-background/50 text-foreground placeholder:text-muted-foreground font-medium"
                          placeholder="Create a strong password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-300 focus-ring rounded-lg p-1"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>

                      {/* Password strength indicator */}
                      {formData.password && (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-3">
                            <div className="flex-1 bg-muted rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                                style={{ width: `${(passwordStrength / 5) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-bold text-muted-foreground">{getPasswordStrengthText()}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-3">
                      <label htmlFor="confirmPassword" className="block font-bold text-foreground">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirmPassword"
                          name="confirmPassword"
                          required
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="w-full pl-12 pr-14 py-4 border border-border/30 rounded-2xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 bg-background/50 text-foreground placeholder:text-muted-foreground font-medium"
                          placeholder="Confirm your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-300 focus-ring rounded-lg p-1"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
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
                          <span>Reset Password</span>
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
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
