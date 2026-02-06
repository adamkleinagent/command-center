import React, { useState } from 'react';
import { createProject } from '@/lib/data';
import { Project } from '@/lib/types';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: (project: Project) => void;
}

const ICONS = ['📁', '🚀', '🎨', '💼', '🏠', '🔧', '📊', '💡', '🌟', '🎯'];
const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444', '#71717a'];

export function NewProjectModal({ isOpen, onClose, onProjectCreated }: NewProjectModalProps) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState(ICONS[0]);
  const [color, setColor] = useState(COLORS[0]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const { data, error } = await createProject(name, icon, color);
      if (error) throw error;
      if (data) {
        onProjectCreated(data);
        setName('');
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
            <h2 className="text-xl font-bold text-white tracking-tight">New Project</h2>
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
                Project Name
              </label>
              <input
                autoFocus
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Marketing Campaign"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 outline-none focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 px-1">
                Icon
              </label>
              <div className="flex flex-wrap gap-2">
                {ICONS.map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIcon(i)}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all ${
                      icon === i ? 'bg-zinc-800 border-zinc-600' : 'bg-transparent border-zinc-900 hover:border-zinc-800'
                    }`}
                  >
                    <span className="text-xl">{i}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 px-1">
                Accent Color
              </label>
              <div className="flex flex-wrap gap-3">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-6 h-6 rounded-full border-2 transition-all transform hover:scale-110 ${
                      color === c ? 'border-white' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
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
                disabled={loading || !name.trim()}
                className="flex-1 px-4 py-3 rounded-xl bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
