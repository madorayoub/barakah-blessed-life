import { useState } from "react"
import { Plus, Check, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Task {
  id: number
  text: string
  completed: boolean
  priority: "normal" | "blessed"
}

const TaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: "Complete morning dhikr", completed: true, priority: "blessed" },
    { id: 2, text: "Review Quran chapter", completed: false, priority: "blessed" },
    { id: 3, text: "Finish work presentation", completed: false, priority: "normal" },
    { id: 4, text: "Call family members", completed: false, priority: "normal" },
  ])
  const [newTask, setNewTask] = useState("")

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, {
        id: Date.now(),
        text: newTask,
        completed: false,
        priority: "normal"
      }])
      setNewTask("")
    }
  }

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const completedCount = tasks.filter(task => task.completed).length

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <span>Today's Tasks</span>
          <span className="text-sm font-normal text-muted-foreground">
            {completedCount}/{tasks.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            className="flex-1"
          />
          <Button onClick={addTask} size="icon" variant="default">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                task.completed
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              <button
                onClick={() => toggleTask(task.id)}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  task.completed
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-muted-foreground hover:border-primary"
                }`}
              >
                {task.completed && <Check className="h-3 w-3" />}
              </button>
              <span
                className={`flex-1 ${
                  task.completed ? "line-through text-muted-foreground" : ""
                }`}
              >
                {task.text}
              </span>
              {task.priority === "blessed" && (
                <Star className="h-4 w-4 text-amber-500" fill="currentColor" />
              )}
            </div>
          ))}
        </div>
        </CardContent>
    </Card>
  )
}

export default TaskManager