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
}

export interface TaskActivity {
  id: string;
  created_at: string;
  task_id: string;
  type: 'note' | 'system';
  content: string;
  author_id: string;
}
