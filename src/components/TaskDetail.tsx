import React, { useState, useEffect } from 'react';
import { Task, TaskActivity } from '@/lib/types';
import { getTaskActivity, addTaskNote, updateTaskStatus, updateTask } from '@/lib/data';

interface TaskDetailProps {
  task: Task;
  onClose: () => void;
  onUpdate: (task: Task) => void;
}

export function TaskDetail({ task, onClose, onUpdate }: TaskDetailProps) {
  const [activity, setActivity] = useState<TaskActivity[]>([]);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'activity' | 'intelligence'>('activity');

  useEffect(() => {
    fetchActivity();
  }, [task.id]);

  const fetchActivity = async () => {
    const { data } = await getTaskActivity(task.id);
    if (data) setActivity(data);
  };

  const handleUpdateTask = async (updates: Partial<Task>) => {
    const { data } = await updateTask(task.id, updates);
    if (data) onUpdate(data);
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;

    const { data } = await addTaskNote(task.id, note);
    if (data) {
      setActivity([...activity, data]);
      setNote('');
    }
  };

  const toggleStatus = async () => {
    const newStatus = task.status === 'done' ? 'todo' : 'done';
    const { data } = await updateTaskStatus(task.id, newStatus);
    if (data) onUpdate(data);
  };

  const handleRunTask = async () => {
    await handleUpdateTask({ execution_status: 'queued' });
  };

  const renderStatusSelector = () => {
    const statuses: Array<Task['status']> = ['todo', 'in-progress', 'done'];
    return (
      <div className="flex p-1 bg-zinc-900 rounded-lg border border-zinc-800">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => handleUpdateTask({ status: s })}
            className={`flex-1 px-3 py-1 text-[10px] font-bold uppercase tracking-tighter rounded-md transition-all ${
              task.status === s 
                ? 'bg-zinc-700 text-white shadow-sm' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {s.replace('-', ' ')}
          </button>
        ))}
      </div>
    );
  };

  const renderSmartActionButton = () => {
    const status = task.execution_status || 'idle';
    
    if (status === 'running' || status === 'queued') {
      return (
        <button 
          disabled
          className="px-6 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest bg-zinc-800 text-emerald-400 border border-emerald-500/30 flex items-center gap-2 animate-pulse"
        >
          <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
          {status === 'queued' ? 'Queued...' : 'Processing...'}
        </button>
      );
    }

    return (
      <button 
        onClick={handleRunTask}
        className="px-6 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest bg-emerald-600 border border-emerald-500 text-white hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/20 active:scale-95"
      >
        Run Task
      </button>
    );
  };

  return (
    <div className="w-full md:w-[450px] lg:w-[550px] h-screen bg-black flex flex-col shadow-2xl border-l border-zinc-900 md:border md:border-zinc-800 md:rounded-l-2xl md:my-4 md:h-[calc(100vh-2rem)] animate-in slide-in-from-right duration-500 ease-out z-50">
      {/* Header */}
      <div className="p-8 border-b border-zinc-900/50">
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex justify-between items-center">
            <div className="flex-1">
               {renderSmartActionButton()}
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/50 border border-zinc-800/50 group transition-all hover:border-zinc-700">
                 <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-tighter">Model:</span>
                 <select 
                  value={task.model || ''} 
                  onChange={(e) => handleUpdateTask({ model: e.target.value as any })}
                  className="bg-transparent text-zinc-300 text-[10px] font-medium outline-none cursor-pointer"
                >
                  <option value="" disabled>Auto</option>
                  <option value="Gemini Flash">Flash</option>
                  <option value="Gemini Pro">Pro</option>
                  <option value="Deepseek V3.2">DS V3</option>
                </select>
              </div>
              
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-900/50 text-zinc-600 hover:text-white hover:bg-zinc-800 transition-all text-sm border border-zinc-800/50">✕</button>
            </div>
          </div>
          
          {renderStatusSelector()}
        </div>

        <h2 className="text-2xl font-bold text-white tracking-tight leading-tight">{task.title}</h2>
        
        <div className="flex items-center gap-6 mt-6">
           <div className="flex items-center gap-2">
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Created</span>
              <span className="text-[10px] text-zinc-400 font-medium tabular-nums">
                {new Date(task.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
           </div>
           
           <div className="flex items-center gap-2">
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Trigger</span>
              <select 
                value={task.trigger_type || 'manual'} 
                onChange={(e) => handleUpdateTask({ trigger_type: e.target.value as any })}
                className="bg-transparent text-zinc-400 font-bold uppercase tracking-tighter text-[10px] outline-none cursor-pointer"
              >
                <option value="manual">Manual</option>
                <option value="scheduled">Scheduled</option>
                <option value="auto">Auto</option>
              </select>
           </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-8 flex gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 border-b border-zinc-900/50">
        <button 
          onClick={() => setActiveTab('activity')}
          className={`py-4 transition-all relative ${activeTab === 'activity' ? 'text-white' : 'hover:text-zinc-400'}`}
        >
          Activity
          {activeTab === 'activity' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />}
        </button>
        <button 
          onClick={() => setActiveTab('intelligence')}
          className={`py-4 transition-all relative ${activeTab === 'intelligence' ? 'text-white' : 'hover:text-zinc-400'}`}
        >
          Intelligence
          {activeTab === 'intelligence' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />}
        </button>
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col overflow-hidden bg-zinc-950/20">
        {activeTab === 'activity' ? (
          <>
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {activity.map((act) => (
                <div key={act.id} className="flex gap-5 group animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[11px] text-zinc-500 font-bold flex-shrink-0 shadow-sm">
                    {act.type === 'system' ? '⚙️' : '👤'}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-baseline">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                        {act.type === 'system' ? 'System' : 'Michael'}
                      </span>
                      <span className="text-[9px] text-zinc-600 font-medium">
                        {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="text-[13px] text-zinc-300 leading-relaxed bg-zinc-900/40 p-4 rounded-2xl border border-zinc-800/50 group-hover:border-zinc-700/50 transition-colors">
                      {act.content}
                    </div>
                  </div>
                </div>
              ))}
              
              {activity.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 opacity-20">
                  <div className="text-2xl mb-4">💬</div>
                  <p className="text-[10px] uppercase tracking-[0.3em]">No activity records</p>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-8 bg-black/50 backdrop-blur-md border-t border-zinc-900/50">
              <form onSubmit={handleAddNote} className="relative">
                <textarea 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Type a note..."
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 pr-14 text-[13px] text-white outline-none focus:border-indigo-500/50 focus:bg-zinc-900 transition-all resize-none h-24 placeholder:text-zinc-600"
                />
                <button 
                  type="submit"
                  disabled={!note.trim()}
                  className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-white text-black flex items-center justify-center hover:bg-zinc-200 transition-all shadow-xl disabled:opacity-20 disabled:scale-95"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-y-auto p-8 space-y-10">
            {task.suggestions && (
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500 mb-5 flex items-center gap-2">
                   <span className="w-1 h-1 bg-indigo-500 rounded-full"></span>
                   Suggestions
                </h3>
                <div className="bg-gradient-to-br from-zinc-900/50 to-transparent border border-zinc-800/50 rounded-2xl p-6">
                  <p className="text-[13px] text-zinc-300 leading-relaxed italic font-serif">
                    "{task.suggestions}"
                  </p>
                </div>
              </section>
            )}

            {task.evidence_box && (
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500 mb-5 flex items-center gap-2">
                   <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
                   Evidence Box
                </h3>
                <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-6">
                  <div className="text-[11px] text-zinc-400 font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto">
                    {task.evidence_box}
                  </div>
                </div>
              </section>
            )}

            {!task.suggestions && !task.evidence_box && (
              <div className="flex flex-col items-center justify-center py-20 opacity-40">
                <div className="text-2xl mb-4 animate-pulse">🧠</div>
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-400">Waiting for Adam's input...</p>
              </div>
            )}

            {(task.suggestions || task.evidence_box) && (
              <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
                <p className="text-[10px] text-indigo-400/80 font-medium leading-relaxed tracking-wide">
                  Intelligence gathered via {task.model || 'Auto'} model analysis.
                </p>
              </div>
            )}

            {/* Hidden config at bottom */}
            <div className="pt-10 border-t border-zinc-900/30">
               <div className="flex flex-col gap-4">
                  <span className="text-[9px] text-zinc-700 font-bold uppercase tracking-widest">Advanced Configuration</span>
                  <div className="grid grid-cols-1 gap-4">
                     {task.trigger_type === 'scheduled' && (
                        <div className="flex flex-col gap-2">
                           <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Scheduled Execution</span>
                           <input 
                              type="datetime-local" 
                              value={task.scheduled_at ? new Date(task.scheduled_at).toISOString().slice(0, 16) : ''}
                              onChange={(e) => handleUpdateTask({ scheduled_at: e.target.value })}
                              className="bg-zinc-900/50 border border-zinc-800/50 text-zinc-400 text-[11px] rounded-xl p-3 outline-none focus:border-zinc-700 transition-all"
                           />
                        </div>
                     )}
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
