import { useState, useEffect } from 'react'
import { format, addDays, isSameDay, set } from 'date-fns'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Task from '@/components/task/task'

export interface Task {
    id: string
    title: string
    dueDate: Date
    reminder: boolean
    repeat: 'daily' | 'weekly' | 'monthly' | null
    status: 'in-progress' | 'completed' | 'cancelled'
    category?: string
    createdAt: Date
}

export const useTaskLogic = () => {
    const [tasks, setTasks] = useState<Task[]>([])
    const [newTask, setNewTask] = useState('')
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    const [selectedRepeat, setSelectedRepeat] = useState<Task['repeat']>(null)
    const [reminder, setReminder] = useState(false)
    const [currentDate, setCurrentDate] = useState(new Date())
    const [updateTasks, setUpdateTasks] = useState<Task[]>([]);
    const [newTasks, setNewTasks] = useState<Task[]>([])

    // Group tasks by status
    const inProgressTasks = tasks.filter(task => task.status === 'in-progress' && isSameDay(task.createdAt, currentDate))
    const completedTasks = tasks.filter(task => task.status === 'completed' && isSameDay(task.createdAt, currentDate))
    const cancelledTasks = tasks.filter(task => task.status === 'cancelled' && isSameDay(task.createdAt, currentDate))

    const addTask = () => {
        if (newTask.trim()) {
            const task: Task = {
                id: Math.random().toString(36).substr(2, 9),
                title: newTask,
                dueDate: selectedDate,
                reminder,
                repeat: selectedRepeat,
                status: 'in-progress',
                createdAt: new Date()
            }
            setNewTasks([...newTasks, task])
            setTasks([...tasks, task])
        }
    }

    const updateTaskStatus = (taskId: string, newStatus: Task['status']) => {
        setTasks(tasks.map(task => 
            task.id === taskId ? { ...task, status: newStatus } : task
        ))
        setNewTasks(newTasks.map(task=>
            task.id === taskId ? {...task, status: newStatus} : task
        ))
        const taskToUpdate = tasks.find(task => task.id === taskId);
        if (taskToUpdate) {
            setUpdateTasks(prev => [...prev, { ...taskToUpdate, status: newStatus }]);
        }
    }

    // Check and update tasks at midnight
    useEffect(() => {
        const checkDate = () => {
            const now = new Date()
            if (now.getHours() === 0 && now.getMinutes() === 0) {
                setTasks(prevTasks => 
                    prevTasks.map(task => {
                        if (task.status === 'in-progress') {
                            const newDueDate = new Date(task.dueDate)
                            newDueDate.setDate(newDueDate.getDate() + 1)
                            return { ...task, dueDate: newDueDate }
                        }
                        return task
                    })
                )
            }
        }

        const interval = setInterval(checkDate, 60000) // Check every minute
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        const fetchTasks = async () => {
            const response = await fetch('/api/tasks')
            const data = await response.json()
            setTasks(data)
        }

        fetchTasks()
    }, [])
    
    const updateTask = async () => {
        try {
            if (updateTasks.length > 0) {
                const response = await fetch('/api/tasks', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updateTasks),
                });
                console.log(response)
            }
        } catch (error) {
            console.error(error)
            toast.error('Failed to update tasks. Please try again.')
        }
    };

    useEffect(() => {
        const handleBeforeUnload = async (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = ''; // Required for Chrome to show the confirmation dialog
            toast.info('Your tasks are being saved.');
            if (newTasks.length > 0) {
                await fetch('/api/tasks', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newTasks),
                });
            }
            await updateTask(); // Ensure updateTask is called
        };
    
        window.addEventListener('beforeunload', handleBeforeUnload);
    
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [newTasks, updateTasks]);

    return {
        tasks,
        newTask,
        setNewTask,
        selectedDate,
        setSelectedDate,
        selectedRepeat,
        setSelectedRepeat,
        reminder,
        setReminder,
        currentDate,
        setCurrentDate,
        inProgressTasks,
        completedTasks,
        cancelledTasks,
        addTask,
        updateTaskStatus,
        Task
    }
}
