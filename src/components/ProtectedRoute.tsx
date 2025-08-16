import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Onboarding } from '@/components/Onboarding'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      navigate('/')
    }
  }, [user, loading, navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Check if user needs onboarding (after successful authentication)
  const onboardingCompleted = localStorage.getItem('onboarding-completed')
  if (!onboardingCompleted) {
    return <Onboarding onComplete={() => localStorage.setItem('onboarding-completed', 'true')} />
  }

  return <>{children}</>
}