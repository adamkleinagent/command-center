import React, { useState } from 'react';
import { Project } from '@/lib/types';
import { createProject } from '@/lib/data';

interface SidebarProps {
  projects: Project[];
  activeProject: string;
  onSelectProject: (id: string) => void;
  onProjectCreated: (project: Project) => void;
  userEmail?: string;
}

export function Sidebar({ 
  projects, 
  activeProject, 
  onSelectProject, 
  onProjectCreated,
  userEmail 
}: SidebarProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    const { data, error } = await createProject(newProjectName);
    if (data) {
      onProjectCreated(data);
      setNewProjectName('');
      setIsCreating(false);
    } else if (error) {
      alert(error.message);
    }
  };

  return (
    <div className="w-64 h-screen bg-black border-r border-zinc-900 flex flex-col text-zinc-400">
      {/* User Profile - Apple Pro Style */}
      <div className="p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white font-medium text-sm">
          {userEmail?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-zinc-100 truncate">{userEmail?.split('@')[0] || 'User'}</div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Pro Workspace</div>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-2 py-4 space-y-0.5">
        <button 
          onClick={() => onSelectProject('all')}
          className={`w-full text-left px-3 py-1.5 rounded-md text-sm flex items-center gap-2.5 transition-colors ${activeProject === 'all' ? 'bg-zinc-900 text-zinc-100' : 'hover:bg-zinc-900/50'}`}
        >
           <span className="text-lg">🗂️</span> All Projects
        </button>
      </div>

      {/* Projects Section */}
      <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 flex justify-between items-center">
          Projects
          <button 
            onClick={() => setIsCreating(true)}
            className="hover:text-zinc-300 text-base font-normal transition-colors"
          >
            ＋
          </button>
        </div>

        {isCreating && (
          <form onSubmit={handleCreateProject} className="px-3 py-2">
            <input 
              autoFocus
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Project name..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-sm text-zinc-200 outline-none focus:border-indigo-500"
              onBlur={() => !newProjectName && setIsCreating(false)}
            />
          </form>
        )}

        {projects.map((p) => (
          <button 
            key={p.id}
            onClick={() => onSelectProject(p.id)}
            className={`w-full text-left px-3 py-1.5 rounded-md text-sm flex items-center gap-2.5 transition-colors ${activeProject === p.id ? 'bg-zinc-900 text-zinc-100 border border-zinc-800' : 'hover:bg-zinc-900/50'}`}
          >
            <span className="text-lg" style={{ color: p.color }}>{p.icon}</span>
            <span className="truncate">{p.name}</span>
          </button>
        ))}
      </div>

      {/* Engine Status / Rate Limits Widget */}
      <div className="p-4 border-t border-zinc-900 bg-zinc-950">
        <div className="p-3 rounded-xl bg-zinc-900/30 border border-zinc-800/50 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Adam Engine</span>
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[10px]">
              <span className="text-zinc-400">Gemini 3 Pro RPD</span>
              <span className="text-zinc-100 font-mono">242/250</span>
            </div>
            <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 w-[96%]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
