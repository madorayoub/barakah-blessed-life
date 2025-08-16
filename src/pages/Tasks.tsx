import { Plus, Filter, Search, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTasks } from '@/hooks/useTasks'
import { TaskCard } from '@/components/TaskCard'
import { TaskDetailSidebar } from '@/components/TaskDetailSidebar'
import { NewTaskDialog } from '@/components/NewTaskDialog'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Tasks = () => {
  const navigate = useNavigate()
  const { tasks, completeTask, deleteTask, loading } = useTasks()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all')
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleTaskClick = (task: any) => {
    setSelectedTask(task)
    setIsSidebarOpen(true)
  }

  const handleSidebarClose = () => {
    setIsSidebarOpen(false)
    setSelectedTask(null)
  }

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
              <h1 className="text-2xl font-bold">Tasks</h1>
              <p className="text-muted-foreground">Manage your daily tasks and goals</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <NewTaskDialog>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </NewTaskDialog>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('all')}
              size="sm"
            >
              All
            </Button>
            <Button
              variant={filterStatus === 'pending' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('pending')}
              size="sm"
            >
              Pending
            </Button>
            <Button
              variant={filterStatus === 'completed' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('completed')}
              size="sm"
            >
              Completed
            </Button>
          </div>
        </div>

        {/* Tasks List */}
        {loading ? (
          <div className="space-y-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-24 bg-muted rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            <p className="text-lg mb-2">
              {searchTerm || filterStatus !== 'all' ? 'No tasks match your criteria' : 'No tasks yet'}
            </p>
            <p className="text-sm mb-4">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Add your first task to get started'
              }
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <NewTaskDialog>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Task
                </Button>
              </NewTaskDialog>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={completeTask}
                onDelete={deleteTask}
                onClick={handleTaskClick}
              />
            ))}
          </div>
        )}

        {/* Task Detail Sidebar */}
        <TaskDetailSidebar
          task={selectedTask}
          isOpen={isSidebarOpen}
          onClose={handleSidebarClose}
          onComplete={completeTask}
          onDelete={(taskId) => {
            deleteTask(taskId)
            handleSidebarClose()
          }}
        />
      </main>
    </div>
  )
}

export default Tasks