import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'
import { toast } from '@/hooks/use-toast'
import { SUPABASE_USING_FALLBACK } from '@/integrations/supabase/client'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (SUPABASE_USING_FALLBACK) {
      setLoading(false)
      setUser(null)
      setSession(null)
      return
    }

    let isMounted = true

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!isMounted) return
        console.log('Auth state changed:', event, session)
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
        
        // Persist session data to help with refresh issues
        if (session) {
          localStorage.setItem('supabase-session', JSON.stringify(session))
        } else {
          localStorage.removeItem('supabase-session')
        }
      }
    )

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (!isMounted) return
        
        if (error) {
          console.error('Error getting session:', error)
          // Try to recover from stored session
          const storedSession = localStorage.getItem('supabase-session')
          if (storedSession) {
            try {
              const parsed = JSON.parse(storedSession)
              setSession(parsed)
              setUser(parsed?.user ?? null)
            } catch {
              localStorage.removeItem('supabase-session')
            }
          }
        } else {
          setSession(session)
          setUser(session?.user ?? null)
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    initializeAuth()

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string, displayName?: string) => {
    if (SUPABASE_USING_FALLBACK) {
      const error = new Error('Authentication is disabled in demo mode')
      toast({
        variant: 'destructive',
        title: 'Unavailable in demo mode',
        description: 'Add Supabase credentials to enable account creation.'
      })
      return { error }
    }

    const redirectUrl = `${window.location.origin}${import.meta.env.BASE_URL}`

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          display_name: displayName
        }
      }
    })

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: error.message
      })
    } else {
      toast({
        title: "Check your email",
        description: "We've sent you a confirmation link"
      })
    }

    return { error }
  }

  const signIn = async (email: string, password: string) => {
    if (SUPABASE_USING_FALLBACK) {
      const error = new Error('Authentication is disabled in demo mode')
      toast({
        variant: "destructive",
        title: "Unavailable in demo mode",
        description: "Add Supabase credentials to enable sign-in."
      })
      return { error }
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: error.message
      })
    } else {
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in"
      })
    }

    return { error }
  }

  const signOut = async () => {
    if (SUPABASE_USING_FALLBACK) {
      toast({
        variant: "destructive",
        title: "Unavailable in demo mode",
        description: "Authentication is disabled when running with local fallback."
      })
      return
    }

    const { error } = await supabase.auth.signOut()

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: error.message
      })
    } else {
      toast({
        title: "Signed out",
        description: "You've been successfully signed out"
      })
    }
  }

  const resetPassword = async (email: string) => {
    if (SUPABASE_USING_FALLBACK) {
      const error = new Error('Authentication is disabled in demo mode')
      toast({
        variant: "destructive",
        title: "Unavailable in demo mode",
        description: "Password resets require Supabase credentials."
      })
      return { error }
    }

    const redirectUrl = `${window.location.origin}${import.meta.env.BASE_URL}auth/reset-password`

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl
    })

    if (error) {
      toast({
        variant: "destructive",
        title: "Reset failed",
        description: error.message
      })
    } else {
      toast({
        title: "Check your email",
        description: "We've sent you a password reset link"
      })
    }

    return { error }
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}