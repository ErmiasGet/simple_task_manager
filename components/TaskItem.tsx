
import React, { useState } from 'react';
import { Task } from '../types';
import { getSmartSubtasks } from '../services/geminiService';

interface TaskItemProps {
  task: Task;
  onToggle: (task: Task) => void;
  onDelete: (id: string) => void;
  onUpdateSubtasks: (id: string, subtasks: string[]) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onUpdateSubtasks }) => {
  const [isExpanding, setIsExpanding] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const handleSmartBreakdown = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (task.subtasks && task.subtasks.length > 0) {
      setIsExpanding(!isExpanding);
      return;
    }

    setIsLoadingAI(true);
    try {
      const suggestions = await getSmartSubtasks(task.title);
      onUpdateSubtasks(task._id, suggestions);
      setIsExpanding(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const priorityColors = {
    low: 'bg-emerald-100 text-emerald-700',
    medium: 'bg-blue-100 text-blue-700',
    high: 'bg-rose-100 text-rose-700',
  };

  return (
    <div className={`group glass mb-4 p-5 rounded-2xl transition-all duration-300 hover:shadow-xl border-l-4 ${task.completed ? 'border-gray-300 opacity-60' : task.priority === 'high' ? 'border-rose-400' : task.priority === 'medium' ? 'border-blue-400' : 'border-emerald-400'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <button 
            onClick={() => onToggle(task)}
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.completed ? 'bg-indigo-500 border-indigo-500' : 'border-gray-300 hover:border-indigo-400'}`}
          >
            {task.completed && (
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
          
          <div className="flex-1">
            <span className={`text-lg font-medium block transition-all ${task.completed ? 'line-through text-gray-400' : 'text-slate-700'}`}>
              {task.title}
            </span>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${priorityColors[task.priority]}`}>
                {task.priority}
              </span>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                {new Date(task.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleSmartBreakdown}
            disabled={isLoadingAI}
            className={`p-2 rounded-xl transition-all ${isLoadingAI ? 'bg-indigo-50 animate-pulse' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
            title="AI Breakdown"
          >
            {isLoadingAI ? (
               <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            )}
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-all"
            title="Delete Task"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {(isExpanding || (task.subtasks && task.subtasks.length > 0)) && isExpanding && (
        <div className="mt-4 pt-4 border-t border-gray-100 animate-fadeIn">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center">
            <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
            Suggested Breakdown
          </h4>
          <ul className="space-y-2">
            {task.subtasks?.map((sub, idx) => (
              <li key={idx} className="flex items-center text-sm text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-3" />
                {sub}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const styleTag = document.createElement('style');
styleTag.innerHTML = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out forwards;
}
`;
document.head.appendChild(styleTag);
