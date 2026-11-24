"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, Leaf } from "lucide-react"
import Header from "../components/Header"
import GoogleAuthButton from "../components/GoogleAuthButton"
import authService from "../services/authService"

export default function SignInPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  // Check if user is already authenticated
  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate("/")
    }
  }, [navigate])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await authService.login(formData)
      if (response.success) {
        await authService.syncLocalData()
        navigate("/")
      } else {
        setError(response.message || "Login failed")
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = () => {
    navigate("/forgot-password")
  }

  const handleSignUp = () => {
    navigate("/signup")
  }

  const handleGoogleCredential = async (credential) => {
    setIsLoading(true)
    setError("")
    try {
      const response = await authService.loginWithGoogle(credential)
      if (!response.success) {
        setError(response.message || "Google sign-in failed")
        return
      }
      await authService.syncLocalData()
      navigate("/")
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="min-h-screen flex">
        {/* Left Side - Image and Testimonial */}
        <div
          className="hidden lg:flex lg:w-1/2 bg-cover bg-center relative"
          style={{
            backgroundImage:
              "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/login-eXBLrI4exFQQHngEb10MuKrd42qeTe.png')",
          }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 flex flex-col justify-end p-12 text-white">
            <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 max-w-md">
              <p className="text-lg italic mb-4">
                "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam
                rem aperiam, eaque ipsa quae ab illo inventore."
              </p>
              <div>
                <p className="font-semibold">Cameron Williamson</p>
                <p className="text-sm opacity-90">Happy Customer</p>
              </div>
            </div>
            {/* Progress dots */}
            <div className="flex space-x-2 mt-6">
              <div className="w-8 h-1 bg-yellow-400 rounded"></div>
              <div className="w-8 h-1 bg-white/30 rounded"></div>
              <div className="w-8 h-1 bg-white/30 rounded"></div>
              <div className="w-8 h-1 bg-white/30 rounded"></div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-8 h-8 bg-green-800 rounded-full flex items-center justify-center">
                <Leaf className="w-5 h-5 text-yellow-400" />
              </div>
              <span className="text-xl font-bold text-gray-800">Plant Shop</span>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h1>
              <p className="text-gray-600">Please fill your detail to access your account.</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Enter Email Address"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="Enter Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-gray-700 hover:text-green-600 underline"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-800 text-white py-3 rounded-lg font-semibold hover:bg-green-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </button>

              <div className="text-center">
                <span className="text-gray-600">or Sign In with</span>
              </div>

              <GoogleAuthButton onCredential={handleGoogleCredential} disabled={isLoading} />

              <div className="text-center">
                <span className="text-gray-600">Don't have an account? </span>
                <button
                  type="button"
                  onClick={handleSignUp}
                  className="text-green-600 hover:text-green-700 font-medium underline"
                >
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
