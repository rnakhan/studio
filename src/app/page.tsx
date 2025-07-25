"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Trash } from "lucide-react";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      try {
        const storedTasks = localStorage.getItem("tasks");
        if (storedTasks) {
          setTasks(JSON.parse(storedTasks));
        }
      } catch (error) {
        console.error("Error loading tasks from local storage:", error);
      }
    }
  }, [isMounted]);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks, isMounted]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim() === "") return;
    const newTask: Task = {
      id: crypto.randomUUID(),
      text: newTaskText,
      completed: false,
    };
    setTasks([newTask, ...tasks]);
    setNewTaskText("");
  };

  const handleToggleComplete = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  if (!isMounted) {
    return (
      <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
        <Card className="w-full max-w-lg animate-pulse">
          <CardHeader className="text-center space-y-2">
            <div className="h-8 bg-muted rounded w-1/2 mx-auto"></div>
            <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
          </CardHeader>
          <CardContent>
            <div className="flex w-full items-center space-x-2">
              <div className="h-10 bg-muted rounded flex-1"></div>
              <div className="h-10 bg-muted rounded w-24"></div>
            </div>
            <div className="mt-6 space-y-3">
              <div className="h-14 bg-muted rounded"></div>
              <div className="h-14 bg-muted rounded"></div>
              <div className="h-14 bg-muted rounded"></div>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 font-body">
      <Card className="w-full max-w-lg shadow-lg border-2">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-headline tracking-tight text-primary">Task Ticker</CardTitle>
          <CardDescription>Your friendly neighborhood task list.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddTask} className="flex w-full items-center space-x-2">
            <Input
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder="e.g. Conquer the world"
              className="flex-1"
              aria-label="New task input"
            />
            <Button type="submit">Add Task</Button>
          </form>
          <div className="mt-6 space-y-2">
            {tasks.length > 0 ? (
              <ul className="space-y-3">
                {tasks.map((task) => (
                  <li
                    key={task.id}
                    className={cn(
                      "flex items-center space-x-4 rounded-lg border p-3 transition-all duration-300 ease-in-out",
                      task.completed
                        ? "bg-accent/10 border-accent/20"
                        : "bg-card hover:bg-muted/50"
                    )}
                  >
                    <Checkbox
                      id={`task-${task.id}`}
                      checked={task.completed}
                      onCheckedChange={() => handleToggleComplete(task.id)}
                      className={cn(
                        "transition-colors",
                        task.completed && "border-accent data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground"
                      )}
                      aria-label={`Mark task ${task.text} as ${task.completed ? 'incomplete' : 'complete'}`}
                    />
                    <label
                      htmlFor={`task-${task.id}`}
                      className={cn(
                        "flex-1 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                        task.completed && "text-muted-foreground line-through"
                      )}
                    >
                      {task.text}
                    </label>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => handleDeleteTask(task.id)}
                      aria-label={`Delete task ${task.text}`}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-10 text-center text-sm text-muted-foreground">
                <p className="font-semibold">All tasks completed!</p>
                <p>Add a new task to get started.</p>
              </div>
            )}
          </div>
        </CardContent>
        {tasks.length > 0 && (
          <CardFooter className="flex justify-center border-t px-6 py-3">
            <p className="text-xs text-muted-foreground">
              You have {tasks.filter(t => !t.completed).length} pending task(s).
            </p>
          </CardFooter>
        )}
      </Card>
    </main>
  );
}
