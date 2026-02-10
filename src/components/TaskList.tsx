import React, { useState } from 'react';
import { Task, Project, MODEL_INFO, ModelType } from '@/lib/types';
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
  const [filter, setFilter] = useState<'all' | 'running' | 'done'>('all');

  const activeProject = projects.find(p => p.id === activeProjectId);
  
  const filteredTasks = tasks.filter(task => {
    if (filter === 'running') return task.execution_status === 'running' || task.execution_status === 'queued';
    if (filter === 'done') return task.status === 'done';
    return true;
  });

  const stats = {
    total: tasks.length,
    running: tasks.filter(t => t.execution_status === 'running' || t.execution_status === 'queued').length,
    done: tasks.filter(t => t.status === 'done').length,
  };

  const getModelDisplay = (task: Task) => {
    const model = task.assigned_model || (task.model?.toLowerCase().includes('flash') ? 'kimi' : 'kimi') as ModelType;
    return MODEL_INFO[model] || MODEL_INFO.kimi;
  };

  return (
    <>
      <div className="flex-1 h-screen bg-zinc-950 flex flex-col border-r border-zinc-900 overflow-hidden">
        {/* Header */}
        <div className="px-4 md:px-8 pt-4 md:pt-8 pb-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                {activeProjectId === 'all' ? 'All Tasks' : activeProject?.name}
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-zinc-500 text-xs font-medium">{stats.total} tasks</span>
                {stats.running > 0 && (
                  <span className="flex items-center gap-1.5 text-emerald-500 text-xs font-medium">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    {stats.running} running
                  </span>
                )}
              </div>
            </div>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-10 h-10 md:w-auto md:px-4 md:h-10 flex items-center justify-center gap-2 bg-white text-black rounded-full md:rounded-xl hover:bg-zinc-200 transition-all shadow-lg font-semibold text-sm"
            >
              <span className="text-lg md:text-base">+</span>
              <span className="hidden md:inline">New Task</span>
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
            {[
              { key: 'all', label: 'All', count: stats.total },
              { key: 'running', label: 'Running', count: stats.running },
              { key: 'done', label: 'Completed', count: stats.done },
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                  filter === key
                    ? 'bg-white text-black shadow-lg'
                    : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {label} <span className="ml-1 opacity-60">{count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto px-2 md:px-4 pb-20 md:pb-4">
          <div className="space-y-2">
            {filteredTasks.map((task) => {
              const modelInfo = getModelDisplay(task);
              
              return (
                <div 
                  key={task.id}
                  onClick={() => onSelectTask(task)}
                  className={`group p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    activeTask?.id === task.id 
                      ? 'bg-zinc-900 border-zinc-700 shadow-xl' 
                      : 'bg-zinc-900/30 border-transparent hover:bg-zinc-900/60 hover:border-zinc-800'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Status Circle */}
                    <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      task.status === 'done' 
                        ? 'bg-emerald-500 border-emerald-500' 
                        : task.execution_status === 'running'
                        ? 'border-emerald-500 bg-emerald-500/20'
                        : 'border-zinc-700 group-hover:border-zinc-500'
                    }`}>
                      {task.status === 'done' && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {task.execution_status === 'running' && (
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-sm font-semibold tracking-tight leading-tight ${
                        task.status === 'done' ? 'text-zinc-500 line-through' : 'text-zinc-100'
                      }`}>
                        {task.title}
                      </h3>
                      
                      {/* Meta row */}
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        {activeProjectId === 'all' && (
                          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 px-2 py-0.5 rounded-md">
                            {projects.find(p => p.id === task.project_id)?.name}
                          </span>
                        )}
                        
                        {/* Model badge */}
                        <span 
                          className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                          style={{ 
                            backgroundColor: `${modelInfo.color}15`,
                            color: modelInfo.color 
                          }}
                        >
                          {modelInfo.name.split(' ')[0]}
                        </span>

                        {/* Execution status */}
                        {task.execution_status === 'running' && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                            <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></span>
                            Running
                          </span>
                        )}
                        {task.execution_status === 'failed' && (
                          <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">
                            Failed
                          </span>
                        )}
                        {task.execution_status === 'question' && (
                          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">
                            Needs Review
                          </span>
                        )}

                        {/* Date */}
                        <span className="text-[10px] text-zinc-600 tabular-nums ml-auto">
                          {new Date(task.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>

                      {/* Instructions preview */}
                      {task.instructions && (
                        <p className="text-xs text-zinc-500 mt-2 line-clamp-2 leading-relaxed">
                          {task.instructions}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredTasks.length === 0 && (
              <div className="flex flex-col items-center justify-center h-64 text-zinc-600">
                <div className="text-4xl mb-3 opacity-30">
                  {filter === 'running' ? '⚡' : filter === 'done' ? '✓' : '📋'}
                </div>
                <p className="text-sm font-medium">
                  {filter === 'running' ? 'No running tasks' : filter === 'done' ? 'No completed tasks' : 'No tasks yet'}
                </p>
                <p className="text-[10px] uppercase tracking-widest mt-1 opacity-50">
                  {filter === 'all' && 'Create one to get started'}
                </p>
              </div>
            )}
          </div>
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
