import React from 'react';
import { MOCK_TASKS } from '@/lib/mock-data';

export function TaskList({ onSelectTask, activeTask }: any) {
  return (
    <div className="flex-1 h-screen bg-zinc-950 flex flex-col">
      {/* Header */}
      <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-950/50 backdrop-blur">
        <h1 className="text-xl font-semibold text-zinc-100">Active Tasks</h1>
        <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-md transition">
          + New Task
        </button>
      </div>

      {/* Filters/Toolbar */}
      <div className="h-10 border-b border-zinc-800 flex items-center px-6 gap-4 text-sm text-zinc-500">
        <span className="text-zinc-200 font-medium border-b-2 border-indigo-500 py-2.5">All Tasks</span>
        <span className="hover:text-zinc-300 cursor-pointer">Agent Queue</span>
        <span className="hover:text-zinc-300 cursor-pointer">Waiting for Review</span>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-2">
        {MOCK_TASKS.map((task) => (
          <div 
            key={task.id}
            onClick={() => onSelectTask(task)}
            className={`group p-4 rounded-lg border cursor-pointer transition-all ${
              activeTask?.id === task.id 
                ? 'bg-zinc-900 border-indigo-500/50 shadow-lg shadow-indigo-900/10' 
                : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {/* Status Checkbox */}
                <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                  task.status === 'done' ? 'bg-indigo-600 border-indigo-600' : 'border-zinc-600 group-hover:border-zinc-500'
                }`}>
                  {task.status === 'done' && <span className="text-white text-xs">✓</span>}
                </div>
                
                <div>
                  <h3 className={`font-medium ${task.status === 'done' ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500">
                    <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">{task.project}</span>
                    <span>• {task.date}</span>
                  </div>
                </div>
              </div>

              {/* Meta Badges */}
              <div className="flex items-center gap-2">
                {task.assignee === 'agent' && (
                  <div className="px-2 py-1 rounded bg-emerald-900/30 text-emerald-400 text-xs border border-emerald-500/20 flex items-center gap-1">
                    🦾 {task.model}
                  </div>
                )}
                {task.assignee === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                    M
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
