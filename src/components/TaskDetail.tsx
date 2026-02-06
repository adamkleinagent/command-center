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

  return (
    <div className="w-[450px] h-screen bg-black flex flex-col shadow-2xl border-l border-zinc-900 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-6 border-b border-zinc-900">
        <div className="flex justify-between items-start mb-6">
          <div className="flex gap-2">
            <button 
              onClick={toggleStatus}
              className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${
                task.status === 'done' 
                  ? 'bg-zinc-800 border-zinc-700 text-zinc-400' 
                  : 'bg-indigo-600 border-indigo-500 text-white'
              }`}
            >
              {task.status === 'done' ? 'Completed' : 'Mark as Done'}
            </button>
            {(task.execution_status === 'idle' || task.execution_status === 'failed' || !task.execution_status) && (
              <button 
                onClick={handleRunTask}
                className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border bg-emerald-600 border-emerald-500 text-white hover:bg-emerald-500 transition-all"
              >
                Run Task
              </button>
            )}
          </div>
          <button onClick={onClose} className="text-zinc-600 hover:text-white transition-colors text-xl">✕</button>
        </div>

        <h2 className="text-xl font-bold text-white tracking-tight mb-2">{task.title}</h2>
        
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-6">
           <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Model</span>
              <select 
                value={task.model || ''} 
                onChange={(e) => handleUpdateTask({ model: e.target.value as any })}
                className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs rounded-lg p-1.5 outline-none focus:border-zinc-700"
              >
                <option value="" disabled>Select Model</option>
                <option value="Gemini Flash">Gemini Flash</option>
                <option value="Gemini Pro">Gemini Pro</option>
                <option value="Deepseek V3.2">Deepseek V3.2</option>
              </select>
           </div>
           <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Trigger</span>
              <select 
                value={task.trigger_type || 'manual'} 
                onChange={(e) => handleUpdateTask({ trigger_type: e.target.value as any })}
                className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs rounded-lg p-1.5 outline-none focus:border-zinc-700"
              >
                <option value="manual">Manual</option>
                <option value="scheduled">Scheduled</option>
                <option value="auto">Auto</option>
              </select>
           </div>
           
           {task.trigger_type === 'scheduled' && (
             <div className="col-span-2 flex flex-col gap-1.5">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Scheduled At</span>
                <input 
                  type="datetime-local" 
                  value={task.scheduled_at ? new Date(task.scheduled_at).toISOString().slice(0, 16) : ''}
                  onChange={(e) => handleUpdateTask({ scheduled_at: e.target.value })}
                  className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs rounded-lg p-1.5 outline-none focus:border-zinc-700"
                />
             </div>
           )}

           <div className="flex items-center gap-4 text-xs">
              <span className="w-20 text-zinc-500 font-bold uppercase tracking-wider">Priority</span>
              <span className={`font-bold uppercase tracking-widest ${task.priority === 'high' ? 'text-red-500' : 'text-zinc-300'}`}>
                {task.priority}
              </span>
           </div>
           <div className="flex items-center gap-4 text-xs">
              <span className="w-20 text-zinc-500 font-bold uppercase tracking-wider">Created</span>
              <span className="text-zinc-300">
                {new Date(task.created_at).toLocaleDateString()}
              </span>
           </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-8 py-2 border-b border-zinc-900 flex gap-6 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
        <button 
          onClick={() => setActiveTab('activity')}
          className={`pb-2 px-1 transition-colors ${activeTab === 'activity' ? 'text-zinc-200 border-b border-white' : 'hover:text-zinc-400'}`}
        >
          Activity
        </button>
        <button 
          onClick={() => setActiveTab('intelligence')}
          className={`pb-2 px-1 transition-colors ${activeTab === 'intelligence' ? 'text-zinc-200 border-b border-white' : 'hover:text-zinc-400'}`}
        >
          Intelligence
        </button>
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeTab === 'activity' ? (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {activity.map((act) => (
                <div key={act.id} className="flex gap-4 group">
                  <div className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] text-zinc-500 font-bold flex-shrink-0">
                    {act.type === 'system' ? '⚙️' : '👤'}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-baseline">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                        {act.type === 'system' ? 'System' : 'Michael'}
                      </span>
                      <span className="text-[9px] text-zinc-600">
                        {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-900/50 p-3 rounded-xl border border-zinc-800/30">
                      {act.content}
                    </p>
                  </div>
                </div>
              ))}
              
              {activity.length === 0 && (
                <div className="text-center py-10 opacity-20">
                  <p className="text-xs uppercase tracking-[0.3em]">No activity yet</p>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-zinc-900 bg-black">
              <form onSubmit={handleAddNote} className="relative">
                <textarea 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a note or update..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 pr-12 text-sm text-white outline-none focus:border-indigo-500 transition-all resize-none h-24"
                />
                <button 
                  type="submit"
                  className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-zinc-200 transition-colors shadow-lg"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            <section>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4">Suggestions</h3>
              <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-5 min-h-[100px]">
                {task.suggestions ? (
                  <p className="text-sm text-zinc-300 leading-relaxed italic">
                    "{task.suggestions}"
                  </p>
                ) : (
                  <p className="text-xs text-zinc-600 uppercase tracking-widest text-center mt-6">No suggestions generated</p>
                )}
              </div>
            </section>

            <section>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4">Evidence Box</h3>
              <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-5 min-h-[150px]">
                {task.evidence_box ? (
                  <div className="text-sm text-zinc-400 font-mono whitespace-pre-wrap leading-relaxed">
                    {task.evidence_box}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-600 uppercase tracking-widest text-center mt-12">No evidence collected</p>
                )}
              </div>
            </section>

            <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
               <p className="text-[10px] text-indigo-400 font-medium leading-relaxed">
                 Intelligence features use the selected model to analyze task context and provide real-time suggestions and evidence gathering.
               </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
