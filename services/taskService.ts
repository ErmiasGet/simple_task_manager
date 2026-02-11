
import { Task, ApiResponse } from '../types';

const API_URL = 'http://localhost:5000/api/tasks';

export const getTasks = async (): Promise<ApiResponse<Task[]>> => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Failed to fetch tasks');
  const data = await response.json();
  return { data, status: response.status };
};

export const createTask = async (taskData: Partial<Task>): Promise<ApiResponse<Task>> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData),
  });
  if (!response.ok) throw new Error('Failed to create task');
  const data = await response.json();
  return { data, status: response.status };
};

export const updateTask = async (id: string, updates: Partial<Task>): Promise<ApiResponse<Task>> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error('Failed to update task');
  const data = await response.json();
  return { data, status: response.status };
};

export const deleteTask = async (id: string): Promise<ApiResponse<void>> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete task');
  return { data: undefined, status: response.status };
};
