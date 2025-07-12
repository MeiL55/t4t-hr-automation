"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const router = useRouter()

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
      console.log("ENV VALUE:", process.env.NEXT_PUBLIC_API_URL)
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/signup`, {
        email,
        password,
        full_name: fullName,
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
              className="border p-2 w-full mb-2"
              type="text"
              placeholder="Full Name"
              onChange={(e) => setFullName(e.target.value)}
            />
            <input
              className="border p-2 w-full mb-2"
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </>
        )}

        {mode === "login" && (
          <input
            className="border p-2 w-full mb-2"
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        )}

        <input
          className="border p-2 w-full mb-4"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="bg-black text-white w-full py-2 rounded mb-2"
          onClick={mode === "login" ? handleLogin : handleSignup}
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