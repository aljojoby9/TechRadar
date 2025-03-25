"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from 'next/navigation'
import { 
  validateEmail,
  getEmailErrorMessage,
  validatePassword,
  getPasswordErrorMessage
} from "@/lib/validation"

export default function SignInForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string
    password?: string
  }>({})
  const supabase = createClient()
  const router = useRouter()

  // Check authentication status when component mounts
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error("Session check error:", error)
          return
        }
        if (session?.user) {
          const userRole = session.user.user_metadata?.role || session.user.user_metadata?.user_type || 'user'
          router.push(`/dashboard/${userRole}`)
        }
      } catch (err) {
        console.error("Auth check error:", err)
      }
    }
    checkAuth()
  }, [router, supabase.auth])

  const validateForm = () => {
    const errors: typeof fieldErrors = {}
    let isValid = true

    // Validate email
    const emailError = getEmailErrorMessage(email)
    if (emailError) {
      errors.email = emailError
      isValid = false
    }

    // Validate password
    const passwordError = getPasswordErrorMessage(password)
    if (passwordError) {
      errors.password = passwordError
      isValid = false
    }

    setFieldErrors(errors)
    return isValid
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value
    setEmail(newEmail)
    const emailError = getEmailErrorMessage(newEmail)
    setFieldErrors(prev => ({ ...prev, email: emailError || undefined }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value
    setPassword(newPassword)
    const passwordError = getPasswordErrorMessage(newPassword)
    setFieldErrors(prev => ({ ...prev, password: passwordError || undefined }))
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setLoading(true)

    if (!validateForm()) {
      setLoading(false)
      return
    }

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (signInError) throw signInError;
      
      if (!data?.user) {
        throw new Error("No user data returned after sign in");
      }

      // Get user role from metadata
      const userRole = data.user.user_metadata?.role || data.user.user_metadata?.user_type || 'user'
      
      // Sign in successful
      setSuccess(true)
      setEmail('')
      setPassword('')
      setFieldErrors({})
      
      // Wait for session to be established
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirect based on user role
      router.push(`/dashboard/${userRole}`)
      
    } catch (err: any) {
      console.error("Authentication error:", err);
      setError(err.message || 'Invalid email or password. Please try again.')
      setLoading(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <form onSubmit={handleSignIn} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
            placeholder="Enter your email"
            disabled={loading}
            className={`w-full ${fieldErrors.email ? 'border-red-500' : ''}`}
          />
          {fieldErrors.email && (
            <p className="text-sm text-red-500">{fieldErrors.email}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
            placeholder="Enter your password"
            disabled={loading}
            className={`w-full ${fieldErrors.password ? 'border-red-500' : ''}`}
          />
          {fieldErrors.password && (
            <p className="text-sm text-red-500">{fieldErrors.password}</p>
          )}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-600">
              Successfully signed in! Redirecting...
            </AlertDescription>
          </Alert>
        )}

        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading}
          size="lg"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </motion.div>
  )
}

