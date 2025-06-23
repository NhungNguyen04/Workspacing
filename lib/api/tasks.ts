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

export async function getTaskContents(taskId: string) {
    const response = await fetch(`/api/tasks/content?taskId=${taskId}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

export async function getAvailableContentsForTask(taskId: string) {
    const response = await fetch(`/api/tasks/content/available?taskId=${taskId}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

export async function addContentToTask(taskId: string, contentId: string) {
    const response = await fetch('/api/tasks/content', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId, contentId }),
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

export async function removeContentFromTask(taskId: string, contentId: string) {
    const response = await fetch('/api/tasks/content', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId, contentId }),
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}
