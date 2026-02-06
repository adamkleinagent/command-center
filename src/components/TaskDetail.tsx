import React, { useState, useEffect } from 'react';
import { Task, TaskActivity } from '@/lib/types';
import { getTaskActivity, addTaskNote, updateTaskStatus } from '@/lib/data';

interface TaskDetailProps {
  task: Task;
  onClose: () => void;
  onUpdate: (task: Task) => void;
}

export function TaskDetail({ task, onClose, onUpdate }: TaskDetailProps) {
  const [activity, setActivity] = useState<TaskActivity[]>([]);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchActivity();
  }, [task.id]);

  const fetchActivity = async () => {
    const { data } = await getTaskActivity(task.id);
    if (data) setActivity(data);
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

  return (
    <div className="w-[450px] h-screen bg-black flex flex-col shadow-2xl border-l border-zinc-900 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-6 border-b border-zinc-900">
        <div className="flex justify-between items-start mb-6">
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
          <button onClick={onClose} className="text-zinc-600 hover:text-white transition-colors text-xl">✕</button>
        </div>

        <h2 className="text-xl font-bold text-white tracking-tight mb-2">{task.title}</h2>
        <div className="space-y-4 mt-6">
           <div className="flex items-center gap-4 text-xs">
              <span className="w-20 text-zinc-500 font-bold uppercase tracking-wider">Priority</span>
              <span className={`font-bold uppercase tracking-widest ${task.priority === 'high' ? 'text-red-500' : 'text-zinc-300'}`}>
                {task.priority}
              </span>
           </div>
           <div className="flex items-center gap-4 text-xs">
              <span className="w-20 text-zinc-500 font-bold uppercase tracking-wider">Created</span>
              <span className="text-zinc-300">
                {new Date(task.created_at).toLocaleString()}
              </span>
           </div>
        </div>
      </div>

      {/* Activity / Chat Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-900 bg-zinc-950/50">
           <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">Activity & Notes</h3>
        </div>
        
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
      </div>
    </div>
  );
}
