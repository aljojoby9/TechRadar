"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/utils/supabase/client"
import { validateName, getNameErrorMessage } from "@/lib/validation"

export default function SignUpForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; general?: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  // Add stronger name validation
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    const nameError = getNameErrorMessage(newName);
    setErrors(prev => ({ ...prev, name: nameError || undefined }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Re-validate all fields
    const nameError = getNameErrorMessage(name);
    const emailError = !email.trim() ? "Email is required" : undefined;
    const passwordError = !password.trim() ? "Password is required" : undefined;

    // Check for any errors
    if (nameError || emailError || passwordError) {
      setErrors({
        name: nameError || undefined,
        email: emailError,
        password: passwordError
      });
      return;
    }
    
    setIsLoading(true)
    setErrors({})
    
    try {
      // Create user in Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      })
      
      if (error) {
        throw error
      }
      
      // Redirect or show success message
      window.location.href = "/dashboard"
    } catch (error: any) {
      console.error("Sign up error:", error)
      setErrors({ general: error?.message || "Failed to sign up" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          placeholder="John Doe"
          value={name}
          onChange={handleNameChange}
          className={errors.name ? "border-red-500" : ""}
        />
        {/* Add error message display */}
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="john@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={errors.password ? "border-red-500" : ""}
        />
        {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
      </div>
      
      {errors.general && (
        <div className="p-3 bg-red-100 border border-red-300 rounded-md text-red-800">
          {errors.general}
        </div>
      )}
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Sign Up"}
      </Button>
    </form>
  )
}