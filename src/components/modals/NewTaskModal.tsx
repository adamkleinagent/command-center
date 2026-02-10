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

type TaskMode = 'quick' | 'smart';

export function NewTaskModal({ 
  isOpen, 
  onClose, 
  projects, 
  activeProjectId, 
  onTaskCreated 
}: NewTaskModalProps) {
  const [mode, setMode] = useState<TaskMode>('quick');
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState(activeProjectId === 'all' ? (projects[0]?.id || '') : activeProjectId);
  const [instructions, setInstructions] = useState('');
  const [model, setModel] = useState<ModelType>('kimi');
  const [triggerType, setTriggerType] = useState<'manual' | 'scheduled'>('manual');
  const [scheduledAt, setScheduledAt] = useState('');
  const [autoProceed, setAutoProceed] = useState(true);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (activeProjectId !== 'all') {
      setProjectId(activeProjectId);
    } else if (!projectId && projects.length > 0) {
      setProjectId(projects[0].id);
    }
  }, [activeProjectId, projects]);

  // Reset form when mode changes
  React.useEffect(() => {
    if (mode === 'smart') {
      setInstructions('');
      setModel('kimi'); // Will be overwritten by orchestrator
    }
  }, [mode]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !projectId) return;

    setLoading(true);
    try {
      const { data, error } = await createTask(projectId, title, '');
      if (error) throw error;
      
      if (data) {
        const updates: Partial<Task> = {
          trigger_type: triggerType,
          scheduled_at: triggerType === 'scheduled' && scheduledAt ? scheduledAt : null,
          auto_proceed: autoProceed,
        };

        if (mode === 'quick') {
          // Quick task - user provides everything
          updates.instructions = instructions || null;
          updates.assigned_model = model;
        } else {
          // Smart task - Opus will orchestrate
          updates.assigned_model = 'opus';
          updates.instructions = null;
        }

        const { data: updated } = await updateTask(data.id, updates);
        onTaskCreated(updated || data);
        
        // Reset form
        setTitle('');
        setInstructions('');
        setModel('kimi');
        setTriggerType('manual');
        setScheduledAt('');
        setAutoProceed(true);
        setMode('quick');
        onClose();
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const workerModels = Object.entries(MODEL_INFO).filter(([key]) => key !== 'opus') as [ModelType, typeof MODEL_INFO.kimi][];

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
        <div className="px-6 py-5 border-b border-zinc-900">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white tracking-tight">New Task</h2>
            <button 
              onClick={onClose}
              className="text-zinc-500 hover:text-zinc-300 transition-colors p-1"
            >
              ✕
            </button>
          </div>

          {/* Mode selector */}
          <div className="flex gap-2 p-1 bg-zinc-900 rounded-xl">
            <button
              type="button"
              onClick={() => setMode('quick')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                mode === 'quick' 
                  ? 'bg-zinc-800 text-white shadow-lg' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              ⚡ Quick Task
            </button>
            <button
              type="button"
              onClick={() => setMode('smart')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                mode === 'smart' 
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              🧠 Smart Task
            </button>
          </div>
          <p className="text-[10px] text-zinc-600 mt-2 text-center">
            {mode === 'quick' 
              ? 'You write instructions, pick the AI model' 
              : 'Just describe the goal — Opus will plan it'}
          </p>
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
                {mode === 'quick' ? 'Task Title' : 'What do you want to achieve?'}
              </label>
              <input
                autoFocus
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={mode === 'quick' ? 'Task name...' : 'e.g., Research competitor pricing strategies'}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 outline-none focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Quick mode: Instructions + Model */}
            {mode === 'quick' && (
              <>
                {/* Instructions */}
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                    Instructions for AI
                  </label>
                  <textarea
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Step-by-step instructions..."
                    rows={4}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 outline-none focus:border-indigo-500 transition-all resize-none font-mono"
                  />
                </div>

                {/* Model selector */}
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                    AI Worker
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {workerModels.map(([key, info]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setModel(key)}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          model === key 
                            ? 'border-indigo-500 bg-indigo-500/10' 
                            : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
                        }`}
                      >
                        <span 
                          className="inline-block w-2 h-2 rounded-full mb-1"
                          style={{ backgroundColor: info.color }}
                        ></span>
                        <div className="text-xs font-semibold text-zinc-200">{info.name.split(' ')[0]}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Smart mode: Opus info */}
            {mode === 'smart' && (
              <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🧠</div>
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-200 mb-1">Opus will orchestrate this task</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Opus (Claude 4.5) will analyze your goal, break it down into actionable steps, 
                      choose the best worker model, and create detailed instructions.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Auto-proceed toggle */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
              <button
                type="button"
                onClick={() => setAutoProceed(!autoProceed)}
                className={`relative w-10 h-6 rounded-full transition-colors flex-shrink-0 ${
                  autoProceed ? 'bg-emerald-600' : 'bg-zinc-700'
                }`}
              >
                <span 
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                    autoProceed ? 'left-5' : 'left-1'
                  }`}
                />
              </button>
              <div>
                <span className="text-xs font-medium text-zinc-300">Auto-proceed</span>
                <p className="text-[10px] text-zinc-600">
                  {mode === 'smart' 
                    ? 'Run worker immediately after Opus creates instructions'
                    : 'Start immediately when scheduled'}
                </p>
              </div>
            </div>

            {/* Schedule option */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  Schedule
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setTriggerType('manual')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
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
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                      triggerType === 'scheduled' 
                        ? 'bg-zinc-800 text-white' 
                        : 'bg-zinc-900 text-zinc-500'
                    }`}
                  >
                    Scheduled
                  </button>
                </div>
              </div>

              {triggerType === 'scheduled' && (
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 outline-none focus:border-indigo-500 transition-all"
                />
              )}
            </div>
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
              disabled={loading || !title.trim() || (mode === 'quick' && !instructions.trim())}
              className={`flex-1 px-4 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 ${
                mode === 'smart'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500'
                  : 'bg-white text-black hover:bg-zinc-200'
              }`}
            >
              {loading ? 'Creating...' : mode === 'smart' ? '🧠 Create Smart Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
