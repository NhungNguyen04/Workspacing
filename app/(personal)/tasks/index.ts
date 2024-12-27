import { Task } from '@/types/task'

export async function fetchTasks() {
    const response = await fetch('/api/tasks')
    return await response.json()
}

export async function createTasks(tasks: Task[]) {
    return await fetch('/api/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(tasks),
    })
}

export async function updateTasks(tasks: Task[]) {
    return await fetch('/api/tasks', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(tasks),
    })
}
