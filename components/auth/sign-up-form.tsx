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

export default function SignUpForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [userType, setUserType] = useState("user")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const supabase = createClient()

  const validateForm = () => {
    if (!name.trim()) {
      setError("Please enter your name")
      return false
    }
    if (!email.trim()) {
      setError("Please enter your email")
      return false
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return false
    }
    return true
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
    } catch (err) {
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
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter your full name"
            disabled={isLoading}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            disabled={isLoading}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Create a password"
            disabled={isLoading}
            className="w-full"
          />
          <p className="text-sm text-gray-500">Must be at least 6 characters long</p>
        </div>

        <div className="space-y-3">
          <Label>Account type</Label>
          <RadioGroup 
            value={userType} 
            onValueChange={setUserType} 
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

