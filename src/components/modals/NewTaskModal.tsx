import React, { useState } from 'react';
import { createTask } from '@/lib/data';
import { Task, Project } from '@/lib/types';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  activeProjectId: string;
  onTaskCreated: (task: Task) => void;
}

export function NewTaskModal({ 
  isOpen, 
  onClose, 
  projects, 
  activeProjectId, 
  onTaskCreated 
}: NewTaskModalProps) {
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState(activeProjectId === 'all' ? (projects[0]?.id || '') : activeProjectId);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync state if activeProjectId changes
  React.useEffect(() => {
    if (activeProjectId !== 'all') {
      setProjectId(activeProjectId);
    } else if (!projectId && projects.length > 0) {
      setProjectId(projects[0].id);
    }
  }, [activeProjectId, projects]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !projectId) return;

    setLoading(true);
    try {
      const { data, error } = await createTask(projectId, title, description);
      if (error) throw error;
      if (data) {
        onTaskCreated(data);
        setTitle('');
        setDescription('');
        onClose();
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white tracking-tight">New Task</h2>
            <button 
              onClick={onClose}
              className="text-zinc-500 hover:text-zinc-300 transition-colors p-1"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 px-1">
                Project
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 outline-none focus:border-indigo-500 transition-all appearance-none"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.icon} {p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 px-1">
                Task Title
              </label>
              <input
                autoFocus
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 outline-none focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 px-1">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add more details..."
                rows={3}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 outline-none focus:border-indigo-500 transition-all resize-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-xl bg-zinc-900 text-zinc-400 text-sm font-semibold hover:bg-zinc-800 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !title.trim()}
                className="flex-1 px-4 py-3 rounded-xl bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
