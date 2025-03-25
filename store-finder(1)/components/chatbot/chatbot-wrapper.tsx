"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Chatbot } from './chatbot'
import { Database } from '@/lib/supabase/types'
import { Session } from '@supabase/supabase-js'
import { PostgrestSingleResponse } from '@supabase/postgrest-js'

interface ChatbotWrapperProps {
  storeId?: string
}

export default function ChatbotWrapper({ storeId }: ChatbotWrapperProps) {
  const [userId, setUserId] = useState<string>()
  const [userRole, setUserRole] = useState<string>()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      if (session?.user) {
        setUserId(session.user.id)
        setIsAuthenticated(true)
        // Get user role
        supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single()
          .then((response: PostgrestSingleResponse<{ role: string }>) => {
            if (response.data) {
              setUserRole(response.data.role)
            }
          })
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      if (session?.user) {
        setUserId(session.user.id)
        setIsAuthenticated(true)
        // Get user role
        supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single()
          .then((response: PostgrestSingleResponse<{ role: string }>) => {
            if (response.data) {
              setUserRole(response.data.role)
            }
          })
      } else {
        setUserId(undefined)
        setUserRole(undefined)
        setIsAuthenticated(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  return (
    <Chatbot
      storeId={storeId}
      userId={userId}
      userRole={userRole}
      isAuthenticated={isAuthenticated}
    />
  )
}