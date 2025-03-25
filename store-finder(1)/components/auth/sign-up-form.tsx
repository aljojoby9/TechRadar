"use client"

import type React from "react"
import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { motion } from "framer-motion"
import { 
  validateName, 
  getNameErrorMessage,
  validateEmail,
  getEmailErrorMessage,
  validatePassword,
  getPasswordErrorMessage,
  validateRole,
  getRoleErrorMessage
} from "@/lib/validation"

export default function SignUpForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [userType, setUserType] = useState("user")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string
    email?: string
    password?: string
    role?: string
  }>({})
  const supabase = createClient()

  const validateForm = () => {
    const errors: typeof fieldErrors = {}
    let isValid = true

    // Validate name
    const nameError = getNameErrorMessage(name)
    if (nameError) {
      errors.name = nameError
      isValid = false
    }

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

    // Validate role
    const roleError = getRoleErrorMessage(userType)
    if (roleError) {
      errors.role = roleError
      isValid = false
    }

    setFieldErrors(errors)
    return isValid
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setName(newName)
    const nameError = getNameErrorMessage(newName)
    setFieldErrors(prev => ({ ...prev, name: nameError || undefined }))
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

  const handleUserTypeChange = (value: string) => {
    setUserType(value)
    const roleError = getRoleErrorMessage(value)
    setFieldErrors(prev => ({ ...prev, role: roleError || undefined }))
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setMessage(null)

    if (!validateForm()) {
      setIsLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            name: name.trim(),
            role: userType,
            user_type: userType,
          },
        },
      })

      if (error) {
        if (error.message.includes('already registered')) {
          setError("An account with this email already exists")
        } else {
          setError(error.message)
        }
        return
      }

      if (data.user && data.user.identities && data.user.identities.length === 0) {
        setError("An account with this email address already exists.")
        return
      }

      setMessage(
        "Success! Please check your email for a confirmation link. You'll be able to sign in after confirming your email."
      )
      
      // Clear form
      setEmail("")
      setPassword("")
      setName("")
      setUserType("user")
      setFieldErrors({})
    } catch (err: any) {
      console.error("Sign up error:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <form onSubmit={handleSignUp} className="space-y-6">
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        {message && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">{message}</h3>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={handleNameChange}
            required
            placeholder="Enter your full name"
            disabled={isLoading}
            className={`w-full ${fieldErrors.name ? 'border-red-500' : ''}`}
          />
          {fieldErrors.name && (
            <p className="text-sm text-red-500">{fieldErrors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
            placeholder="Enter your email"
            disabled={isLoading}
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
            placeholder="Create a password"
            disabled={isLoading}
            className={`w-full ${fieldErrors.password ? 'border-red-500' : ''}`}
          />
          {fieldErrors.password && (
            <p className="text-sm text-red-500">{fieldErrors.password}</p>
          )}
          <p className="text-sm text-gray-500">
            Must be at least 8 characters long with one uppercase letter, one lowercase letter, and one number
          </p>
        </div>

        <div className="space-y-3">
          <Label>Account type</Label>
          <RadioGroup 
            value={userType} 
            onValueChange={handleUserTypeChange} 
            className="flex space-x-6"
            disabled={isLoading}
          >
            <div className="flex items-center">
              <RadioGroupItem value="user" id="user" />
              <Label htmlFor="user" className="ml-2">
                Regular User
              </Label>
            </div>
            <div className="flex items-center">
              <RadioGroupItem value="store_owner" id="store_owner" />
              <Label htmlFor="store_owner" className="ml-2">
                Store Owner
              </Label>
            </div>
          </RadioGroup>
          {fieldErrors.role && (
            <p className="text-sm text-red-500">{fieldErrors.role}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? "Creating account..." : "Sign up"}
        </Button>
      </form>
    </motion.div>
  )
}

