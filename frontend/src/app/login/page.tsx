"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { debounce } from 'lodash'

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [telephone, setTelephone] = useState("")
  const [emailValid, setEmailValid] = useState<null | "valid" | "invalid" | "taken">(null)
  const [telephoneValid, setTelephoneValid] = useState<null | "valid" | "invalid" | "taken">(null)

  const router = useRouter()

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
    if (email && mode === "signup") {
      validateEmail(email)
    }
  }, [email, mode, validateEmail])

  useEffect(() => {
    if (telephone && mode === "signup") {
      validateTelephone(telephone)
    }
  }, [telephone, mode, validateTelephone])

  const handleLogin = async () => {
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
    } catch {
      alert("Login failed")
    }
  }

  const handleSignup = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/signup`, {
        email,
        password,
        full_name: fullName,
        telephone,
      })
      alert("Signup successful! Please log in.")
      setMode("login")
    } catch {
      alert("Signup failed")
    }
  }

  const getInputBorder = (valid: "valid" | "invalid" | "taken" | null) => {
    if (valid === "invalid" || valid === "taken") return "border-red-500"
    if (valid === "valid") return "border-green-500"
    return "border-gray-300"
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-2">
          {mode === "login" ? "Welcome Back!" : "Create an Account"}
        </h1>
        <p className="text-center text-gray-600 mb-6">
          {mode === "login" ? "Sign in to continue" : "Join us today"}
        </p>

        {mode === "signup" && (
          <>
            <input
              className={`input-field ${getInputBorder(null)}`}
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <div className="relative">
              <input
                className={`input-field ${getInputBorder(emailValid)}`}
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailValid === "valid" && <span className="validation-icon">✅</span>}
            </div>
            <p className="validation-message">
              {emailValid === "invalid" && "Invalid email format"}
              {emailValid === "taken" && "Email is already taken"}
            </p>
            <div className="relative">
              <input
                className={`input-field ${getInputBorder(telephoneValid)}`}
                type="text"
                placeholder="Telephone"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
              />
              {telephoneValid === "valid" && <span className="validation-icon">✅</span>}
            </div>
            <p className="validation-message">
              {telephoneValid === "invalid" && "Invalid phone format (10–15 digits)"}
              {telephoneValid === "taken" && "Phone number already in use"}
            </p>
          </>
        )}

        {mode === "login" && (
          <>
            <input
              className={`input-field ${getInputBorder(emailValid)}`}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="validation-message">
              {emailValid === "invalid" && "Invalid email format"}
            </p>
          </>
        )}

        <input
          className="input-field"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          onClick={mode === "login" ? handleLogin : handleSignup}
          disabled={
            mode === "signup" &&
            (emailValid !== "valid" || telephoneValid !== "valid" || !fullName || !password)
          }
        >
          {mode === "login" ? "Login" : "Sign Up"}
        </button>

        <p className="text-center text-sm mt-4">
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <button
                className="text-blue-600 hover:underline"
                onClick={() => setMode("signup")}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                className="text-blue-600 hover:underline"
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
