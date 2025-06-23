import { Task } from '@/types/task'

export async function fetchTasks() {
    const response = await fetch('/api/tasks')
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json()
}

export async function createTasks(tasks: Task[]) {
    const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(tasks),
    })
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json()
}

export async function updateTasks(tasks: Task[]) {
    const response = await fetch('/api/tasks', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(tasks),
    })
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json()
}
