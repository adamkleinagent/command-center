import React, { useState } from 'react';
import { Project } from '@/lib/types';
import { NewProjectModal } from './modals/NewProjectModal';

interface SidebarProps {
  projects: Project[];
  activeProject: string;
  onSelectProject: (id: string) => void;
  onProjectCreated: (project: Project) => void;
  userEmail?: string;
  onClose?: () => void;
}

export function Sidebar({ 
  projects, 
  activeProject, 
  onSelectProject, 
  onProjectCreated,
  userEmail,
  onClose 
}: SidebarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="w-72 md:w-64 h-screen bg-black border-r border-zinc-900 flex flex-col text-zinc-400">
        {/* Header with close button on mobile */}
        <div className="p-4 flex items-center justify-between md:justify-start gap-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
              {userEmail?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-zinc-100 truncate">{userEmail?.split('@')[0] || 'User'}</div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Command Center</div>
            </div>
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-900 text-zinc-500"
            >
              ✕
            </button>
          )}
        </div>

        {/* Navigation */}
        <div className="px-3 py-4 space-y-1">
          <button 
            onClick={() => onSelectProject('all')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm flex items-center gap-3 transition-all ${
              activeProject === 'all' 
                ? 'bg-zinc-900 text-zinc-100 shadow-lg' 
                : 'hover:bg-zinc-900/50'
            }`}
          >
            <span className="text-lg">📋</span> 
            <span className="font-medium">All Tasks</span>
          </button>
          
          <button 
            onClick={() => onSelectProject('all')}
            className="w-full text-left px-4 py-2.5 rounded-xl text-sm flex items-center gap-3 transition-all hover:bg-zinc-900/50 text-zinc-500"
          >
            <span className="text-lg">📊</span> 
            <span className="font-medium">Dashboard</span>
            <span className="ml-auto text-[9px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full font-bold">Soon</span>
          </button>
        </div>

        {/* Projects Section */}
        <div className="flex-1 overflow-y-auto px-3">
          <div className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 flex justify-between items-center">
            Projects
            <button 
              onClick={() => setIsModalOpen(true)}
              className="hover:text-zinc-300 text-base font-normal transition-colors w-6 h-6 flex items-center justify-center rounded-md hover:bg-zinc-800"
            >
              +
            </button>
          </div>

          <div className="space-y-1">
            {projects.map((p) => (
              <button 
                key={p.id}
                onClick={() => onSelectProject(p.id)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm flex items-center gap-3 transition-all ${
                  activeProject === p.id 
                    ? 'bg-zinc-900 text-zinc-100 shadow-lg border border-zinc-800' 
                    : 'hover:bg-zinc-900/50'
                }`}
              >
                <span className="text-lg" style={{ color: p.color }}>{p.icon}</span>
                <span className="truncate font-medium">{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Engine Status Widget */}
        <div className="p-4 border-t border-zinc-900">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 border border-zinc-800/50 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">AI Engine</span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                <span className="text-[9px] text-emerald-500 font-bold">Online</span>
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-zinc-900/50 rounded-lg p-2">
                <div className="text-lg font-bold text-zinc-100">3</div>
                <div className="text-[8px] text-zinc-500 uppercase tracking-wider">Running</div>
              </div>
              <div className="bg-zinc-900/50 rounded-lg p-2">
                <div className="text-lg font-bold text-emerald-400">12</div>
                <div className="text-[8px] text-zinc-500 uppercase tracking-wider">Done</div>
              </div>
              <div className="bg-zinc-900/50 rounded-lg p-2">
                <div className="text-lg font-bold text-zinc-100">5</div>
                <div className="text-[8px] text-zinc-500 uppercase tracking-wider">Queue</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <NewProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onProjectCreated={onProjectCreated}
      />
    </>
  );
}
