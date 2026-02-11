
export interface Task {
  _id: string;
  title: string;
  completed: boolean;
  createdAt: number;
  subtasks?: string[];
  priority: 'low' | 'medium' | 'high';
}

export type FilterType = 'all' | 'pending' | 'completed';

export interface ApiResponse<T> {
  data: T;
  status: number;
}
