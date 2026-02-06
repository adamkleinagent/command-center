export interface Project {
  id: string;
  created_at: string;
  name: string;
  icon: string;
  color: string;
  owner_id: string;
}

export interface Task {
  id: string;
  created_at: string;
  project_id: string;
  title: string;
  description: string | null;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
  author_id: string;
  model?: 'Gemini Flash' | 'Gemini Pro' | 'Deepseek V3.2';
  trigger_type?: 'manual' | 'scheduled' | 'auto';
  scheduled_at?: string | null;
  execution_status?: 'idle' | 'queued' | 'running' | 'failed' | 'success' | 'question';
  suggestions?: string | null;
  evidence_box?: string | null;
}

export interface TaskActivity {
  id: string;
  created_at: string;
  task_id: string;
  type: 'note' | 'system';
  content: string;
  author_id: string;
}
