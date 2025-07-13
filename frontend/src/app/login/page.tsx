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
    } catch (err) {
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
    } catch (err) {
      alert("Signup failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-lg font-bold mb-4">
          {mode === "login" ? "Login" : "Sign Up"}
        </h1>

        {mode === "signup" && (
          <>
            <input
              className="border p-2 w-full mb-1"
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <input
              className="border p-2 w-full mb-1"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="text-xs text-gray-500 mb-2">
              {emailValid === "invalid" && "Invalid email format"}
              {emailValid === "taken" && "Email is already taken"}
              {emailValid === "valid" && "✅ Email is available"}
            </p>
            <input
              className="border p-2 w-full mb-1"
              type="text"
              placeholder="Telephone"
              value={telephone}
              onChange={(e) => {
                const val = e.target.value
                console.log("typing:", val)
                setTelephone(val)
                console.log("telephone:", telephone)
              }}
            />
            <p className="text-xs text-gray-500 mb-2">
              {telephoneValid === "invalid" && "Invalid phone format (10–15 digits)"}
              {telephoneValid === "taken" && "Phone number already in use"}
              {telephoneValid === "valid" && "✅ Phone number looks good"}
            </p>
          </>
        )}

        {mode === "login" && (
          <>
            <input
              className="border p-2 w-full mb-1"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="text-xs text-gray-500 mb-2">
              {emailValid === "invalid" && "Invalid email format"}
            </p>
          </>
        )}

        <input
          className="border p-2 w-full mb-4"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="bg-black text-white w-full py-2 rounded mb-2 disabled:opacity-50"
          onClick={mode === "login" ? handleLogin : handleSignup}
          disabled={
            mode === "signup" &&
            (emailValid !== "valid" || telephoneValid !== "valid" || !fullName || !password)
          }
        >
          {mode === "login" ? "Login" : "Sign Up"}
        </button>

        <p className="text-center text-sm">
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <button
                className="text-blue-600 underline"
                onClick={() => setMode("signup")}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                className="text-blue-600 underline"
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
