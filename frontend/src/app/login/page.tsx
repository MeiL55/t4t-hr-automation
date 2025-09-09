"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import debounce from "lodash.debounce"
import "@/app/globals.css"


export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [telephone, setTelephone] = useState("")
  const [emailValid, setEmailValid] = useState<null | "valid" | "invalid" | "taken">(null)
  const [telephoneValid, setTelephoneValid] = useState<null | "valid" | "invalid" | "taken">(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: "", type: "" })

  const router = useRouter()

  const validateEmail = useCallback(
    debounce(async (inputEmail: string) => {
      if (!inputEmail) return setEmailValid(null)
      const isFormatValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputEmail)
      if (!isFormatValid) return setEmailValid("invalid")
      try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/check_email`, 
          { email: inputEmail },
          { withCredentials: true }
        )
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
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/check_telephone`, 
          { telephone: inputTel },
          { withCredentials: true }
        )
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ text: "", type: "" })

    try {
      if (mode === "login") {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, 
          { email, password }, 
          { withCredentials: true }
        )
        
        // Get role from server response (JWT token stored in HTTP-only cookie)
        const { role, user } = res.data

        setMessage({ text: `Login successful! Redirecting...`, type: "success" })
        
        if (role === "hr") {
          router.push("/hr_dashboard")
        } else if (role === "admin") {
          router.push("/admin_panel")
        } else if (role === "applicant") {
          const statusRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/application_status`, {
            withCredentials: true
          });
          const status = statusRes.data.status;
          if (status === 'not_started') {
            router.push("/apply");
          } else {
            router.push(`/applystage`);
          }
        } else {
          router.push("/unauthorized")
        }
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/signup`, {
          email,
          password,
          full_name: fullName,
          telephone,
        }, { withCredentials: true })
        
        setMessage({ text: "Signup successful! Please log in.", type: "success" })
        setMode("login")
        setFullName("")
        setTelephone("")
        setEmailValid(null)
        setTelephoneValid(null)
      }
    } catch (err) {
      setMessage({ 
        text: mode === "login" 
          ? "Login failed. Please check your credentials." 
          : "Signup failed. Please try again.",
        type: "error"
      })
    } finally {
      setLoading(false)
    }
  }

  const getValidationClass = (state: typeof emailValid) => {
    switch (state) {
      case "valid": return "login-validation-valid"
      case "invalid": return "login-validation-invalid"
      case "taken": return "login-validation-invalid"
      default: return "login-validation-neutral"
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="login-subtitle">
            {mode === "login" ? "Sign in to continue" : "Get started with your account"}
          </p>
        </div>

        {message.text && (
          <div className={message.type === "success" ? "login-message-success" : "login-message-error"}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          {mode === "signup" && (
            <>
              <div>
                <label htmlFor="fullName" className="login-label">
                  Full Name
                </label>
                <input
                  id="fullName"
                  className="login-input"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="login-label">
                  Email
                </label>
                <input
                  id="email"
                  className="login-input"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {emailValid && (
                  <p className={getValidationClass(emailValid)}>
                    {emailValid === "invalid" && "Invalid email format"}
                    {emailValid === "taken" && "Email is already taken"}
                    {emailValid === "valid" && "✓ Email is available"}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="telephone" className="login-label">
                  Phone Number
                </label>
                <input
                  id="telephone"
                  className="login-input"
                  type="tel"
                  placeholder="+1234567890"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  required
                />
                {telephoneValid && (
                  <p className={getValidationClass(telephoneValid)}>
                    {telephoneValid === "invalid" && "Invalid phone format (10-15 digits)"}
                    {telephoneValid === "taken" && "Phone number already in use"}
                    {telephoneValid === "valid" && "✓ Phone number looks good"}
                  </p>
                )}
              </div>
            </>
          )}

          {mode === "login" && (
            <div>
              <label htmlFor="email" className="login-label">
                Email
              </label>
              <input
                id="email"
                className="login-input"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label htmlFor="password" className="login-label">
              Password
            </label>
            <input
              id="password"
              className="login-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            {mode === "signup" && (
              <p className="login-validation-neutral">
                Password must be at least 6 characters
              </p>
            )}
          </div>

          <button
            type="submit"
            className={`login-button ${loading ? "login-button-disabled" : ""}`}
            disabled={
              loading ||
              (mode === "signup" &&
                (emailValid !== "valid" || telephoneValid !== "valid" || !fullName || !password))
            }
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <span className="login-spinner"></span>
                Processing...
              </span>
            ) : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="login-footer">
          <p className="login-switch-text">
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="login-switch-button"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="login-switch-button"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}