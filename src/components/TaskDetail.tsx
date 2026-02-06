import React, { useState } from 'react';
import { Task } from '@/lib/mock-data';

interface TaskDetailProps {
  task: Task | null;
  onClose: () => void;
}

export function TaskDetail({ task, onClose }: TaskDetailProps) {
  const [activeTab, setActiveTab] = useState('chat'); // chat | docs | config

  if (!task) {
    return (
      <div className="w-96 border-l border-zinc-800 bg-zinc-950 flex items-center justify-center text-zinc-600 text-sm">
        Select a task to view details
      </div>
    );
  }

  return (
    <div className="w-[450px] border-l border-zinc-800 bg-zinc-950 flex flex-col h-screen shadow-2xl">
      {/* Header */}
      <div className="h-14 border-b border-zinc-800 flex items-center justify-between px-4 bg-zinc-900/50">
        <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
          <span>TASK-{task.id.toUpperCase()}</span>
          <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">{task.project}</span>
        </div>
        <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300">✕</button>
      </div>

      {/* Title & Meta */}
      <div className="p-6 border-b border-zinc-800">
        <div className="flex items-center gap-2 mb-3">
           <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
             {task.status}
           </span>
           {task.priority === 'high' && <span className="text-red-500 text-xs font-bold">!!! High Priority</span>}
        </div>
        <h2 className="text-xl font-semibold text-zinc-100 mb-4 leading-snug">{task.title}</h2>
        
        {/* Agent Controls */}
        <div className="bg-zinc-900 rounded p-3 border border-zinc-800 flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400 uppercase font-bold tracking-wider">Agent Configuration</span>
                <span className={`w-2 h-2 rounded-full ${task.assignee === 'agent' ? 'bg-emerald-500' : 'bg-zinc-600'}`} />
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-zinc-950 p-2 rounded border border-zinc-800">
                    <div className="text-zinc-500 text-xs">Assigned</div>
                    <div className="text-zinc-200 flex items-center gap-1">
                        {task.assignee === 'agent' ? '🦾 Adam' : '👤 Mišo'}
                    </div>
                </div>
                <div className="bg-zinc-950 p-2 rounded border border-zinc-800">
                    <div className="text-zinc-500 text-xs">Model</div>
                    <div className="text-zinc-200">{task.model || 'N/A'}</div>
                </div>
            </div>

            {task.assignee === 'agent' && (
                <button className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded uppercase tracking-wide transition flex items-center justify-center gap-2">
                    ▶ Run Agent Now
                </button>
            )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800">
          <button 
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 ${activeTab === 'chat' ? 'border-indigo-500 text-zinc-100' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
          >
              Chat & Updates
          </button>
          <button 
            onClick={() => setActiveTab('docs')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 ${activeTab === 'docs' ? 'border-indigo-500 text-zinc-100' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
          >
              Documents
          </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto bg-zinc-950/50 p-4">
          {activeTab === 'chat' ? (
              <div className="space-y-4">
                  <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-500 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">M</div>
                      <div className="bg-zinc-800/50 p-3 rounded-lg rounded-tl-none text-sm text-zinc-300">
                          Adam, prosím nakonfiguruj ten LLM fallback, padá mi to keď vypadne Gemini.
                      </div>
                  </div>
                  <div className="flex gap-3 flex-row-reverse">
                      <div className="w-8 h-8 rounded-full bg-emerald-900 flex-shrink-0 flex items-center justify-center text-xl border border-emerald-500/30">🦾</div>
                      <div className="bg-emerald-900/10 border border-emerald-500/10 p-3 rounded-lg rounded-tr-none text-sm text-zinc-300">
                          Jasné. Pozrel som config a vidím, že OpenRouter kľúč tam je, ale nie je v zozname `fallbacks`.
                          <br/><br/>
                          Navrhujem pridať `openrouter/openai/gpt-3.5-turbo` ako zálohu.
                      </div>
                  </div>
              </div>
          ) : (
              <div className="text-zinc-500 text-sm text-center mt-10">No documents generated yet.</div>
          )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-900">
          <input 
            type="text" 
            placeholder="Reply or command..." 
            className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-sm text-white outline-none focus:border-indigo-500 transition"
          />
      </div>
    </div>
  );
}
