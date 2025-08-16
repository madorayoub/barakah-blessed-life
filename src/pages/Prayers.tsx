import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

const Prayers = () => {
  const navigate = useNavigate()
  
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="h-4 w-px bg-border" />
            <div>
              <h1 className="text-2xl font-bold">Prayer Times</h1>
              <p className="text-muted-foreground">Your daily prayer schedule and tracking</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">
          Prayer times interface will be implemented here
        </p>
      </main>
    </div>
  )
}

export default Prayers