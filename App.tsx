
import React, { useState, useEffect, useCallback } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "./services/taskService";
import { Task, FilterType } from "./types";
import { TaskItem } from "./components/TaskItem";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [filter, setFilter] = useState<FilterType>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isBackendOnline, setIsBackendOnline] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await getTasks();
      setTasks(res.data);
      setIsBackendOnline(true);
    } catch (err) {
      console.error("Backend Error:", err);
      setIsBackendOnline(false);
      setErrorMessage("The backend server (localhost:5000) is unreachable. Please ensure it is running.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Create new task
  const handleAddTask = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim()) return;
    
    try {
      const res = await createTask({ title, priority });
      setTasks(prev => [res.data, ...prev]);
      setTitle("");
      setPriority('medium');
    } catch (err) {
      setErrorMessage("Failed to add task. Is the server running?");
    }
  };

  // Toggle completed
  const handleToggleComplete = async (task: Task) => {
    try {
      const res = await updateTask(task._id, { completed: !task.completed });
      setTasks(prev => prev.map(t => t._id === task._id ? res.data : t));
    } catch (err) {
      setErrorMessage("Failed to update task.");
    }
  };

  // Delete task
  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id);
      setTasks(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      setErrorMessage("Failed to delete task.");
    }
  };

  // Update subtasks from Gemini
  const handleUpdateSubtasks = async (id: string, subtasks: string[]) => {
    try {
      const res = await updateTask(id, { subtasks });
      setTasks(prev => prev.map(t => t._id === id ? res.data : t));
    } catch (err) {
      setErrorMessage("Failed to save AI subtasks.");
    }
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 md:py-20">
      {/* Header & Status */}
      <div className="flex justify-center mb-4">
         <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${isBackendOnline === true ? 'bg-emerald-100 text-emerald-600' : isBackendOnline === false ? 'bg-rose-100 text-rose-600' : 'bg-gray-100 text-gray-500'}`}>
            <span className={`w-2 h-2 rounded-full ${isBackendOnline === true ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
            <span>Backend: {isBackendOnline === true ? 'Online' : isBackendOnline === false ? 'Offline' : 'Checking...'}</span>
         </div>
      </div>

      <header className="text-center mb-12">
        <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-3">
          Simple  <span className="text-indigo-600">Task Manager</span>
        </h1>
        <p className="text-slate-500 font-medium">Powering your productivity with MongoDB Atlas.</p>
      </header>

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-8 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start space-x-3 text-rose-800 animate-fadeIn">
          <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm">
            <p className="font-bold">Connection Issue</p>
            <p className="opacity-80">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total', value: stats.total, color: 'text-indigo-600' },
          { label: 'Pending', value: stats.pending, color: 'text-rose-500' },
          { label: 'Done', value: stats.completed, color: 'text-emerald-500' }
        ].map(stat => (
          <div key={stat.label} className="glass p-4 rounded-2xl text-center shadow-sm">
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Input Section */}
      <section className="glass p-6 rounded-3xl shadow-xl border border-white/40 mb-10">
        <form onSubmit={handleAddTask} className="space-y-4">
          <div className="relative group">
            <input
              type="text"
              placeholder="Add a persistent task..."
              value={title}
              disabled={isBackendOnline === false}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-6 pr-12 text-lg focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400 font-medium disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isBackendOnline === false || !title.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          
          <div className="flex items-center justify-between px-2">
             <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Priority:</span>
                {(['low', 'medium', 'high'] as Task['priority'][]).map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${priority === p ? 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-300' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                  >
                    {p}
                  </button>
                ))}
             </div>
          </div>
        </form>
      </section>

      {/* Filters */}
      <div className="flex items-center space-x-2 mb-6 px-1">
        {(['all', 'pending', 'completed'] as FilterType[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${filter === f ? 'bg-white text-indigo-600 shadow-md ring-1 ring-indigo-50' : 'text-slate-500 hover:bg-white/50'}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
            <p className="mt-4 text-slate-400 font-medium">Connecting to MongoDB...</p>
          </div>
        ) : filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <TaskItem
              key={task._id}
              task={task}
              onToggle={handleToggleComplete}
              onDelete={handleDelete}
              onUpdateSubtasks={handleUpdateSubtasks}
            />
          ))
        ) : (
          <div className="text-center py-20 glass rounded-3xl border-dashed border-2 border-slate-200">
            <svg className="w-16 h-16 text-slate-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-slate-400">{isBackendOnline === false ? 'Connection Error' : 'No tasks found'}</h3>
            <p className="text-slate-400">{isBackendOnline === false ? 'Please run node server.js locally.' : 'Add a task to populate your database.'}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-20 text-center opacity-40">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">simple  &bull; task manager &bull; Ermiget</p>
      </footer>
    </div>
  );
}

export default App;
