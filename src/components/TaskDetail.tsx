import React, { useState, useEffect } from 'react';
import { Task, TaskActivity, MODEL_INFO, ModelType } from '@/lib/types';
import { getTaskActivity, addTaskNote, updateTask } from '@/lib/data';

interface TaskDetailProps {
  task: Task;
  onClose: () => void;
  onUpdate: (task: Task) => void;
}

export function TaskDetail({ task, onClose, onUpdate }: TaskDetailProps) {
  const [activity, setActivity] = useState<TaskActivity[]>([]);
  const [note, setNote] = useState('');
  const [activeTab, setActiveTab] = useState<'activity' | 'instructions' | 'runs'>('instructions');
  const [editingInstructions, setEditingInstructions] = useState(false);
  const [instructionsText, setInstructionsText] = useState(task.instructions || '');

  useEffect(() => {
    fetchActivity();
    setInstructionsText(task.instructions || '');
  }, [task.id, task.instructions]);

  const fetchActivity = async () => {
    const { data } = await getTaskActivity(task.id);
    if (data) setActivity(data);
  };

  const handleUpdateTask = async (updates: Partial<Task>) => {
    const { data } = await updateTask(task.id, updates);
    if (data) onUpdate(data);
  };

  const handleSaveInstructions = async () => {
    await handleUpdateTask({ instructions: instructionsText });
    setEditingInstructions(false);
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

  const handleRunTask = async () => {
    await handleUpdateTask({ execution_status: 'queued' });
  };

  const currentModel = (task.assigned_model || 'kimi') as ModelType;
  const modelInfo = MODEL_INFO[currentModel];

  return (
    <div className="w-full h-full bg-black flex flex-col md:border-l md:border-zinc-800">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-zinc-900 bg-zinc-950">
        {/* Top row - actions */}
        <div className="flex items-center justify-between gap-4 mb-4">
          {/* Back button - mobile */}
          <button 
            onClick={onClose}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-900 text-zinc-400"
          >
            ←
          </button>

          {/* Run button */}
          {task.execution_status === 'running' || task.execution_status === 'queued' ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">
                {task.execution_status === 'queued' ? 'Queued' : 'Running'}
              </span>
            </div>
          ) : (
            <button 
              onClick={handleRunTask}
              disabled={!task.instructions}
              className="px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-600 text-white hover:bg-emerald-500 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ▶ Run Task
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            {/* Model selector */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800">
              <span 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: modelInfo.color }}
              ></span>
              <select 
                value={currentModel}
                onChange={(e) => handleUpdateTask({ assigned_model: e.target.value as ModelType })}
                className="bg-transparent text-zinc-300 text-xs font-medium outline-none cursor-pointer"
              >
                {Object.entries(MODEL_INFO).map(([key, info]) => (
                  <option key={key} value={key}>{info.name}</option>
                ))}
              </select>
            </div>

            {/* Close button - desktop */}
            <button 
              onClick={onClose}
              className="hidden md:flex w-8 h-8 items-center justify-center rounded-full bg-zinc-900 text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Status row */}
        <div className="flex gap-2 mb-4">
          {(['todo', 'in-progress', 'done'] as const).map((s) => (
            <button
              key={s}
              onClick={() => handleUpdateTask({ status: s })}
              className={`flex-1 px-3 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${
                task.status === s 
                  ? 'bg-zinc-800 text-white' 
                  : 'bg-zinc-900/50 text-zinc-600 hover:text-zinc-400'
              }`}
            >
              {s.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Title */}
        <h2 className="text-lg md:text-xl font-bold text-white tracking-tight leading-tight">
          {task.title}
        </h2>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-zinc-500">
          <span>Created {new Date(task.created_at).toLocaleDateString()}</span>
          
          <div className="flex items-center gap-2">
            <span className="text-zinc-600">Trigger:</span>
            <select 
              value={task.trigger_type || 'manual'} 
              onChange={(e) => handleUpdateTask({ trigger_type: e.target.value as any })}
              className="bg-transparent text-zinc-400 font-medium outline-none cursor-pointer"
            >
              <option value="manual">Manual</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>

          {task.trigger_type === 'scheduled' && (
            <input 
              type="datetime-local" 
              value={task.scheduled_at ? new Date(task.scheduled_at).toISOString().slice(0, 16) : ''}
              onChange={(e) => handleUpdateTask({ scheduled_at: e.target.value })}
              className="bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs rounded-lg px-2 py-1 outline-none"
            />
          )}
        </div>

        {/* Auto-proceed toggle */}
        <div className="flex items-center gap-3 mt-4 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
          <button
            onClick={() => handleUpdateTask({ auto_proceed: !task.auto_proceed })}
            className={`relative w-10 h-6 rounded-full transition-colors ${
              task.auto_proceed ? 'bg-emerald-600' : 'bg-zinc-700'
            }`}
          >
            <span 
              className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                task.auto_proceed ? 'left-5' : 'left-1'
              }`}
            />
          </button>
          <div>
            <span className="text-xs font-medium text-zinc-300">Auto-proceed</span>
            <p className="text-[10px] text-zinc-600">Run automatically when Opus creates instructions</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 md:px-6 flex gap-6 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-600 border-b border-zinc-900 bg-zinc-950">
        {[
          { key: 'instructions', label: 'Instructions' },
          { key: 'runs', label: 'Run History' },
          { key: 'activity', label: 'Activity' },
        ].map(({ key, label }) => (
          <button 
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`py-3 transition-all relative ${activeTab === key ? 'text-white' : 'hover:text-zinc-400'}`}
          >
            {label}
            {activeTab === key && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full" />}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'instructions' && (
          <div className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Task Instructions</h3>
              {!editingInstructions && task.instructions && (
                <button 
                  onClick={() => setEditingInstructions(true)}
                  className="text-xs text-indigo-400 hover:text-indigo-300"
                >
                  Edit
                </button>
              )}
            </div>
            
            {editingInstructions || !task.instructions ? (
              <div className="space-y-3">
                <textarea 
                  value={instructionsText}
                  onChange={(e) => setInstructionsText(e.target.value)}
                  placeholder="Write detailed instructions for the AI worker...

Example:
1. Research the topic thoroughly
2. Summarize key findings
3. Provide recommendations"
                  className="w-full h-64 bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-200 outline-none focus:border-indigo-500 transition-all resize-none font-mono"
                />
                <div className="flex gap-2">
                  {task.instructions && (
                    <button 
                      onClick={() => {
                        setInstructionsText(task.instructions || '');
                        setEditingInstructions(false);
                      }}
                      className="px-4 py-2 rounded-lg bg-zinc-900 text-zinc-400 text-xs font-medium hover:bg-zinc-800"
                    >
                      Cancel
                    </button>
                  )}
                  <button 
                    onClick={handleSaveInstructions}
                    disabled={!instructionsText.trim()}
                    className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-500 disabled:opacity-50"
                  >
                    Save Instructions
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4">
                <pre className="text-sm text-zinc-300 whitespace-pre-wrap font-mono leading-relaxed">
                  {task.instructions}
                </pre>
              </div>
            )}

            {/* Intelligence section */}
            {(task.suggestions || task.evidence_box) && (
              <div className="mt-6 space-y-4">
                {task.suggestions && (
                  <div>
                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">AI Suggestions</h4>
                    <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4">
                      <p className="text-sm text-indigo-200 italic">"{task.suggestions}"</p>
                    </div>
                  </div>
                )}
                {task.evidence_box && (
                  <div>
                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Evidence / Output</h4>
                    <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4">
                      <pre className="text-xs text-zinc-400 font-mono whitespace-pre-wrap">{task.evidence_box}</pre>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'runs' && (
          <div className="p-4 md:p-6">
            <div className="flex flex-col items-center justify-center py-16 text-zinc-600">
              <div className="text-3xl mb-3 opacity-30">📊</div>
              <p className="text-sm font-medium">Run history coming soon</p>
              <p className="text-[10px] uppercase tracking-widest mt-1 opacity-50">Will show all task executions</p>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
              {activity.map((act) => (
                <div key={act.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs flex-shrink-0">
                    {act.type === 'system' ? '🤖' : '👤'}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                        {act.type === 'system' ? 'System' : 'You'}
                      </span>
                      <span className="text-[10px] text-zinc-600">
                        {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="text-sm text-zinc-300 bg-zinc-900/50 p-3 rounded-xl border border-zinc-800/50">
                      {act.content}
                    </div>
                  </div>
                </div>
              ))}
              
              {activity.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-zinc-600">
                  <div className="text-3xl mb-3 opacity-30">💬</div>
                  <p className="text-sm font-medium">No activity yet</p>
                </div>
              )}
            </div>

            {/* Note input */}
            <div className="p-4 border-t border-zinc-900 bg-zinc-950">
              <form onSubmit={handleAddNote} className="relative">
                <textarea 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a note..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 pr-12 text-sm text-white outline-none focus:border-indigo-500 transition-all resize-none h-20"
                />
                <button 
                  type="submit"
                  disabled={!note.trim()}
                  className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-zinc-200 transition-all disabled:opacity-30"
                >
                  ↑
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
