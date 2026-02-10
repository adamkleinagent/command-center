export interface Project {
  id: string;
  created_at: string;
  name: string;
  icon: string;
  color: string;
  owner_id: string;
}

export type ModelType = 'kimi' | 'deepseek' | 'glm' | 'opus';

export interface Task {
  id: string;
  created_at: string;
  project_id: string;
  title: string;
  description: string | null;
  status: 'todo' | 'in-progress' | 'done';
  due_date: string | null;
  author_id: string;
  // Updated model types
  model?: 'Gemini Flash' | 'Gemini Pro' | 'Deepseek V3.2'; // legacy
  assigned_model?: ModelType;
  trigger_type?: 'manual' | 'scheduled' | 'auto';
  scheduled_at?: string | null;
  execution_status?: 'idle' | 'queued' | 'running' | 'failed' | 'success' | 'question';
  suggestions?: string | null;
  evidence_box?: string | null;
  // New fields
  instructions?: string | null;
  auto_proceed?: boolean;
}

export interface TaskActivity {
  id: string;
  created_at: string;
  task_id: string;
  type: 'note' | 'system';
  content: string;
  author_id: string;
}

export interface TaskRun {
  id: string;
  created_at: string;
  task_id: string;
  model: string;
  status: 'running' | 'success' | 'failed' | 'question';
  output: string | null;
  duration_ms: number | null;
  error: string | null;
}

// Model display info
export const MODEL_INFO: Record<ModelType, { name: string; description: string; color: string }> = {
  kimi: { name: 'Kimi K2.5', description: 'Fast & reliable worker', color: '#10b981' },
  deepseek: { name: 'DeepSeek V3', description: 'Deep reasoning', color: '#6366f1' },
  glm: { name: 'GLM 4.7', description: 'Best for scheduling', color: '#f59e0b' },
  opus: { name: 'Opus 4.5', description: 'Orchestrator', color: '#ec4899' },
};
