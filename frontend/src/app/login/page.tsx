"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import debounce from "lodash.debounce"

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [telephone, setTelephone] = useState("")
  const [emailValid, setEmailValid] = useState<null | "valid" | "invalid" | "taken">(null)
  const [telephoneValid, setTelephoneValid] = useState<null | "valid" | "invalid" | "taken">(null)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  // Email validation (debounced)
  const validateEmail = useCallback(
    debounce(async (inputEmail: string) => {
      if (!inputEmail) return setEmailValid(null)
      const isFormatValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputEmail)
      if (!isFormatValid) return setEmailValid("invalid")
      try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/check_email`, { email: inputEmail })
        setEmailValid(res.data.available ? "valid" : "taken")
      } catch {
        setEmailValid(null)
      }
    }, 400),
    []
  )

  // Phone validation (debounced)
  const validateTelephone = useCallback(
    debounce(async (inputTel: string) => {
      if (!inputTel) return setTelephoneValid(null)
      const isFormatValid = /^\+?\d{10,15}$/.test(inputTel)
      if (!isFormatValid) return setTelephoneValid("invalid")
      try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/check_telephone`, { telephone: inputTel })
        setTelephoneValid(res.data.available ? "valid" : "taken")
      } catch {
        setTelephoneValid(null)
      }
    }, 400),
    []
  )

  useEffect(() => {
    if (email && mode === "signup") validateEmail(email)
  }, [email, mode, validateEmail])

  useEffect(() => {
    if (telephone && mode === "signup") validateTelephone(telephone)
  }, [telephone, mode, validateTelephone])

  // Handle login
  const handleLogin = async () => {
    setIsLoading(true)
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, { email, password })
      const token = res.data.token
      localStorage.setItem("token", token)
      const payload = JSON.parse(atob(token.split(".")[1]))
      const role = payload.role
      localStorage.setItem("role", role)

      if (role === "hr") router.push("/hr_dashboard")
      else if (role === "admin") router.push("/admin_panel")
      else if (role === "applicant") router.push("/apply")
      else router.push("/unauthorized")
    } catch (err) {
      alert("Login failed. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle signup
  const handleSignup = async () => {
    setIsLoading(true)
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/signup", {
        email,
        password,
        full_name: fullName,
        telephone,
      })
      alert("Account created! Please log in.")
      setMode("login")
      setEmail("")
      setPassword("")
      setFullName("")
      setTelephone("")
    } catch (err) {
      alert("Signup failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {mode === "login" ? "Welcome Back" : "Create an Account"}
        </h1>

        {mode === "signup" && (
          <>
            <div className="mb-4">
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailValid === "invalid" && <p className="text-red-500 text-sm mt-1">Invalid email format</p>}
              {emailValid === "taken" && <p className="text-red-500 text-sm mt-1">Email already in use</p>}
              {emailValid === "valid" && <p className="text-green-500 text-sm mt-1">Email available</p>}
            </div>
            <div className="mb-4">
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                type="tel"
                placeholder="Phone Number"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
              />
              {telephoneValid === "invalid" && <p className="text-red-500 text-sm mt-1">Invalid phone format</p>}
              {telephoneValid === "taken" && <p className="text-red-500 text-sm mt-1">Phone already in use</p>}
              {telephoneValid === "valid" && <p className="text-green-500 text-sm mt-1">Phone number is valid</p>}
            </div>
          </>
        )}

        {mode === "login" && (
          <div className="mb-4">
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        )}

        <div className="mb-6">
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className={`w-full py-2 px-4 rounded-lg text-white font-medium ${
            isLoading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
          } transition-colors`}
          onClick={mode === "login" ? handleLogin : handleSignup}
          disabled={
            isLoading ||
            (mode === "signup" && (emailValid !== "valid" || telephoneValid !== "valid" || !fullName || !password))
          }
        >
          {isLoading ? "Processing..." : mode === "login" ? "Log In" : "Sign Up"}
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <button
                className="text-indigo-600 hover:text-indigo-800 font-medium"
                onClick={() => setMode("signup")}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                className="text-indigo-600 hover:text-indigo-800 font-medium"
                onClick={() => setMode("login")}
              >
                Log in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
