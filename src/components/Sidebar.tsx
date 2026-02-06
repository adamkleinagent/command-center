import React from 'react';
import { MOCK_PROJECTS } from '@/lib/mock-data';

export function Sidebar({ activeProject, onSelectProject }: any) {
  return (
    <div className="w-64 h-screen bg-zinc-900 border-r border-zinc-800 flex flex-col text-zinc-400">
      {/* User Profile */}
      <div className="p-4 border-b border-zinc-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">M</div>
        <div>
          <div className="text-sm font-medium text-zinc-200">Mišo</div>
          <div className="text-xs text-zinc-500">Workspace Owner</div>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-2 space-y-1 mt-2">
        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-600">Views</div>
        <button className="w-full text-left px-3 py-2 rounded hover:bg-zinc-800 text-sm flex items-center gap-2 text-zinc-100">
           🗂️ All Projects
        </button>
        <button className="w-full text-left px-3 py-2 rounded hover:bg-zinc-800 text-sm flex items-center gap-2">
           📥 Inbox <span className="ml-auto bg-indigo-600 text-white text-[10px] px-1.5 rounded-full">2</span>
        </button>
      </div>

      {/* Projects */}
      <div className="p-2 space-y-1 mt-4 flex-1 overflow-y-auto">
        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-600">Projects</div>
        {MOCK_PROJECTS.map((p) => (
          <button 
            key={p.id}
            onClick={() => onSelectProject(p.id)}
            className={`w-full text-left px-3 py-2 rounded text-sm flex items-center gap-2 ${activeProject === p.id ? 'bg-zinc-800 text-zinc-100' : 'hover:bg-zinc-800'}`}
          >
            <span className={`w-2 h-2 rounded-full ${p.color}`} />
            {p.name}
          </button>
        ))}
      </div>

      {/* Agent Status */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-900/50 border border-emerald-500/30 flex items-center justify-center text-xl">🦾</div>
          <div>
            <div className="text-sm font-medium text-zinc-200">Adam</div>
            <div className="text-xs text-emerald-500 flex items-center gap-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Online
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
