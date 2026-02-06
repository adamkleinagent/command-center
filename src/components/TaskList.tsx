import React, { useState } from 'react';
import { Task, Project } from '@/lib/types';
import { NewTaskModal } from './modals/NewTaskModal';

interface TaskListProps {
  tasks: Task[];
  projects: Project[];
  activeProjectId: string;
  activeTask: Task | null;
  onSelectTask: (task: Task) => void;
  onTaskCreated: (task: Task) => void;
}

export function TaskList({ 
  tasks, 
  projects, 
  activeProjectId, 
  activeTask, 
  onSelectTask,
  onTaskCreated 
}: TaskListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeProject = projects.find(p => p.id === activeProjectId);

  return (
    <>
      <div className="flex-1 h-screen bg-zinc-950 flex flex-col border-r border-zinc-900">
        {/* Header - Apple Pro Style */}
        <div className="h-20 flex items-end justify-between px-8 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {activeProjectId === 'all' ? 'All Tasks' : activeProject?.name}
            </h1>
            <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest mt-1">
              {tasks.length} {tasks.length === 1 ? 'Task' : 'Tasks'} Total
            </p>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-8 h-8 flex items-center justify-center bg-white text-black rounded-full hover:bg-zinc-200 transition-colors shadow-lg"
          >
            ＋
          </button>
        </div>

        {/* Toolbar / Filters */}
        <div className="px-8 py-2 border-b border-zinc-900 flex gap-6 text-xs font-bold uppercase tracking-widest text-zinc-600">
          <button className="text-zinc-200 border-b border-white pb-2 px-1">Recent</button>
          <button className="hover:text-zinc-400 pb-2 px-1 transition-colors">Important</button>
          <button className="hover:text-zinc-400 pb-2 px-1 transition-colors">Review</button>
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {tasks.map((task) => (
            <div 
              key={task.id}
              onClick={() => onSelectTask(task)}
              className={`group mx-4 p-4 rounded-xl border transition-all duration-200 ${
                activeTask?.id === task.id 
                  ? 'bg-zinc-900 border-zinc-700 shadow-xl' 
                  : 'bg-transparent border-transparent hover:bg-zinc-900/40 hover:border-zinc-800'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Simple Apple-style Status Circle */}
                <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  task.status === 'done' 
                    ? 'bg-indigo-500 border-indigo-500' 
                    : 'border-zinc-700 group-hover:border-zinc-500'
                }`}>
                  {task.status === 'done' && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className={`text-sm font-semibold tracking-tight ${
                    task.status === 'done' ? 'text-zinc-600 line-through' : 'text-zinc-100'
                  }`}>
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1.5">
                    {activeProjectId === 'all' && (
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                        {projects.find(p => p.id === task.project_id)?.name}
                      </span>
                    )}
                    <span className="text-[10px] font-medium text-zinc-600">
                      {new Date(task.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                    {task.priority === 'high' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    )}
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="flex flex-col items-end gap-1">
                  {task.execution_status === 'running' && (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                      <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-tighter">Running</span>
                    </div>
                  )}
                  {task.execution_status === 'question' && (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                      <span className="text-[9px] font-bold text-amber-500 uppercase tracking-tighter">Question ?</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    {task.model && (
                      <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">
                        {task.model.split(' ')[0]}
                      </span>
                    )}
                    {task.status === 'in-progress' && (
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[9px] font-bold uppercase tracking-tighter border border-indigo-500/20">
                        Active
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {tasks.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-zinc-600">
              <div className="text-4xl mb-2 opacity-20">🦾</div>
              <p className="text-sm font-medium">No tasks found</p>
              <p className="text-[10px] uppercase tracking-widest mt-1 opacity-50">Select a project to add one</p>
            </div>
          )}
        </div>
      </div>

      <NewTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        projects={projects}
        activeProjectId={activeProjectId}
        onTaskCreated={onTaskCreated}
      />
    </>
  );
}

