import React, { useState } from 'react';
import { createTask, updateTask } from '@/lib/data';
import { Task, Project, MODEL_INFO, ModelType } from '@/lib/types';

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
  const [instructions, setInstructions] = useState('');
  const [model, setModel] = useState<ModelType>('kimi');
  const [triggerType, setTriggerType] = useState<'manual' | 'scheduled'>('manual');
  const [scheduledAt, setScheduledAt] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

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
      // Create task first
      const { data, error } = await createTask(projectId, title, '');
      if (error) throw error;
      
      if (data) {
        // Then update with additional fields
        const { data: updated } = await updateTask(data.id, {
          instructions: instructions || null,
          assigned_model: model,
          trigger_type: triggerType,
          scheduled_at: triggerType === 'scheduled' && scheduledAt ? scheduledAt : null,
        });
        
        onTaskCreated(updated || data);
        
        // Reset form
        setTitle('');
        setInstructions('');
        setModel('kimi');
        setTriggerType('manual');
        setScheduledAt('');
        setShowAdvanced(false);
        onClose();
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="w-full md:max-w-lg bg-zinc-950 border border-zinc-800 rounded-t-3xl md:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-900 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white tracking-tight">New Task</h2>
          <button 
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 transition-colors p-1"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-5">
            {/* Project */}
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                Project
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 outline-none focus:border-indigo-500 transition-all"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.icon} {p.name}</option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
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

            {/* Instructions */}
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                Instructions for AI
              </label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Detailed instructions for the AI worker..."
                rows={4}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 outline-none focus:border-indigo-500 transition-all resize-none font-mono"
              />
            </div>

            {/* Model selector */}
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                AI Model
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.entries(MODEL_INFO) as [ModelType, typeof MODEL_INFO.kimi][]).map(([key, info]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setModel(key)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      model === key 
                        ? 'border-indigo-500 bg-indigo-500/10' 
                        : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: info.color }}
                      ></span>
                      <span className="text-sm font-semibold text-zinc-200">{info.name}</span>
                    </div>
                    <p className="text-[10px] text-zinc-500">{info.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced toggle */}
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full text-left text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-2"
            >
              <span className={`transition-transform ${showAdvanced ? 'rotate-90' : ''}`}>▶</span>
              Advanced options
            </button>

            {/* Advanced options */}
            {showAdvanced && (
              <div className="space-y-4 p-4 bg-zinc-900/30 rounded-xl border border-zinc-800/50">
                {/* Trigger type */}
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                    Trigger
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setTriggerType('manual')}
                      className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                        triggerType === 'manual' 
                          ? 'bg-zinc-800 text-white' 
                          : 'bg-zinc-900 text-zinc-500'
                      }`}
                    >
                      Manual
                    </button>
                    <button
                      type="button"
                      onClick={() => setTriggerType('scheduled')}
                      className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                        triggerType === 'scheduled' 
                          ? 'bg-zinc-800 text-white' 
                          : 'bg-zinc-900 text-zinc-500'
                      }`}
                    >
                      Scheduled
                    </button>
                  </div>
                </div>

                {/* Schedule picker */}
                {triggerType === 'scheduled' && (
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                      Run At
                    </label>
                    <input
                      type="datetime-local"
                      value={scheduledAt}
                      onChange={(e) => setScheduledAt(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 outline-none focus:border-indigo-500 transition-all"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-6 pt-0 flex gap-3">
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
              className="flex-1 px-4 py-3 rounded-xl bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition-all disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
