"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Heart, Mail, Lock, User, Phone, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import axios from "axios"

// Debounce utility
const debounce = <T extends (...args: any[]) => any>(func: T, delay: number) => {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    telephone: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [validation, setValidation] = useState({
    emailValid: null as null | "valid" | "invalid" | "taken",
    telephoneValid: null as null | "valid" | "invalid" | "taken"
  })
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  const validateEmail = useCallback(
    debounce(async (inputEmail: string) => {
      if (!inputEmail) return setValidation(prev => ({ ...prev, emailValid: null }))
      
      const isFormatValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputEmail)
      if (!isFormatValid) {
        return setValidation(prev => ({ ...prev, emailValid: "invalid" }))
      }

      try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/check_email`, { 
          email: inputEmail 
        })
        setValidation(prev => ({ 
          ...prev, 
          emailValid: res.data.available ? "valid" : "taken" 
        }))
      } catch {
        setValidation(prev => ({ ...prev, emailValid: null }))
      }
    }, 400),
    []
  )

  const validateTelephone = useCallback(
    debounce(async (inputTel: string) => {
      if (!inputTel) return setValidation(prev => ({ ...prev, telephoneValid: null }))
      
      const isFormatValid = /^\+?\d{10,15}$/.test(inputTel)
      if (!isFormatValid) {
        return setValidation(prev => ({ ...prev, telephoneValid: "invalid" }))
      }

      try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/check_telephone`, { 
          telephone: inputTel 
        })
        setValidation(prev => ({ 
          ...prev, 
          telephoneValid: res.data.available ? "valid" : "taken" 
        }))
      } catch {
        setValidation(prev => ({ ...prev, telephoneValid: null }))
      }
    }, 400),
    []
  )

  useEffect(() => {
    if (formData.email && mode === "signup") {
      validateEmail(formData.email)
    }
  }, [formData.email, mode, validateEmail])

  useEffect(() => {
    if (formData.telephone && mode === "signup") {
      validateTelephone(formData.telephone)
    }
  }, [formData.telephone, mode, validateTelephone])

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handleLogin = async () => {
    setIsLoading(true)
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
        email: formData.email,
        password: formData.password
      })
      
      const token = res.data.token
      localStorage.setItem("token", token)
      
      const payload = JSON.parse(atob(token.split(".")[1]))
      const role = payload.role
      localStorage.setItem("role", role)

      toast.success("Login successful!")
      
      if (role === "hr") router.push("/hr_dashboard")
      else if (role === "admin") router.push("/admin_panel")
      else if (role === "applicant") router.push("/apply")
      else router.push("/unauthorized")
    } catch (err) {
      toast.error("Login failed. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async () => {
    setIsLoading(true)
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/signup`, {
        email: formData.email,
        password: formData.password,
        full_name: formData.fullName,
        telephone: formData.telephone
      })
      
      toast.success("Account created! Please log in.")
      setMode("login")
      setFormData({ email: "", password: "", fullName: "", telephone: "" })
    } catch (err) {
      toast.error("Signup failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const isSignupValid = mode === "signup" && 
    validation.emailValid === "valid" && 
    validation.telephoneValid === "valid" && 
    formData.fullName && 
    formData.password

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-medium border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Heart className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Teens 4 Teens
              </h1>
            </div>
            <CardTitle className="text-xl">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleInputChange("fullName")}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange("email")}
                className={
                  mode === "signup" && validation.emailValid === "invalid" 
                    ? "border-destructive" 
                    : mode === "signup" && validation.emailValid === "valid"
                    ? "border-green-500"
                    : ""
                }
              />
              {mode === "signup" && validation.emailValid === "invalid" && (
                <p className="text-sm text-destructive">Invalid email format</p>
              )}
              {mode === "signup" && validation.emailValid === "taken" && (
                <p className="text-sm text-destructive">Email already in use</p>
              )}
              {mode === "signup" && validation.emailValid === "valid" && (
                <p className="text-sm text-green-600">Email available</p>
              )}
            </div>

            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="telephone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  Phone Number
                </Label>
                <Input
                  id="telephone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.telephone}
                  onChange={handleInputChange("telephone")}
                  className={
                    validation.telephoneValid === "invalid" 
                      ? "border-destructive" 
                      : validation.telephoneValid === "valid"
                      ? "border-green-500"
                      : ""
                  }
                />
                {validation.telephoneValid === "invalid" && (
                  <p className="text-sm text-destructive">Invalid phone format (10-15 digits)</p>
                )}
                {validation.telephoneValid === "taken" && (
                  <p className="text-sm text-destructive">Phone already in use</p>
                )}
                {validation.telephoneValid === "valid" && (
                  <p className="text-sm text-green-600">Phone number is valid</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange("password")}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
              onClick={mode === "login" ? handleLogin : handleSignup}
              disabled={isLoading || (mode === "signup" && !isSignupValid)}
            >
              {isLoading ? "Processing..." : mode === "login" ? "Sign In" : "Create Account"}
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {mode === "login" ? "Don't have an account?" : "Already have an account?"}
              </p>
              <Button
                variant="link"
                className="text-primary font-medium"
                onClick={() => {
                  setMode(mode === "login" ? "signup" : "login")
                  setFormData({ email: "", password: "", fullName: "", telephone: "" })
                  setValidation({ emailValid: null, telephoneValid: null })
                }}
              >
                {mode === "login" ? "Sign up here" : "Sign in here"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
