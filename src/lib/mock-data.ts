// Mock dáta pre prototyp
export const MOCK_PROJECTS = [
  { id: 'p1', name: 'OpenClaw Integration', status: 'active', color: 'bg-emerald-500' },
  { id: 'p2', name: 'Personal Finance', status: 'planning', color: 'bg-blue-500' },
  { id: 'p3', name: 'Smart Home Setup', status: 'paused', color: 'bg-zinc-500' },
];

export const MOCK_TASKS = [
  { 
    id: 't1', 
    title: 'Configure LLM Fallback', 
    project: 'OpenClaw Integration', 
    status: 'todo', 
    assignee: 'agent', 
    model: 'gemini-pro',
    priority: 'high',
    date: 'Today'
  },
  { 
    id: 't2', 
    title: 'Setup Supabase Schema', 
    project: 'OpenClaw Integration', 
    status: 'in-progress', 
    assignee: 'agent', 
    model: 'gpt-4',
    priority: 'medium',
    date: 'Tomorrow'
  },
  { 
    id: 't3', 
    title: 'Review Monthly Budget', 
    project: 'Personal Finance', 
    status: 'review', 
    assignee: 'user', 
    model: null,
    priority: 'high',
    date: 'Fri, Feb 9'
  },
];
