import { supabase } from './supabase'
import { Project, Task, TaskActivity } from './types'

/**
 * PROJECTS
 */
export async function getProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: true })
  return { data: data as Project[], error }
}

export async function createProject(name: string, icon: string = '📁', color: string = '#6366f1') {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('projects')
    .insert([{ name, icon, color, owner_id: user.id }])
    .select()
    .single()
  return { data: data as Project, error }
}

/**
 * TASKS
 */
export async function getTasks(projectId?: string) {
  let query = supabase.from('tasks').select('*')
  
  if (projectId) {
    query = query.eq('project_id', projectId)
  }

  const { data, error } = await query.order('created_at', { ascending: false })
  return { data: data as Task[], error }
}

export async function createTask(
  projectId: string, 
  title: string, 
  description: string = '', 
  model?: Task['model'],
  trigger_type?: Task['trigger_type'],
  scheduled_at?: Task['scheduled_at']
) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('tasks')
    .insert([{ 
      project_id: projectId, 
      title, 
      description, 
      author_id: user.id,
      model,
      trigger_type,
      scheduled_at
    }])
    .select()
    .single()
  return { data: data as Task, error }
}

export async function updateTask(
  taskId: string, 
  updates: Partial<Task>
) {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .select()
    .single()
  return { data: data as Task, error }
}

export async function updateTaskIntelligence(
  taskId: string, 
  updates: {
    execution_status?: Task['execution_status'],
    suggestions?: Task['suggestions'],
    evidence_box?: Task['evidence_box']
  }
) {
  return updateTask(taskId, updates)
}

export async function updateTaskStatus(taskId: string, status: Task['status']) {
  const { data, error } = await supabase
    .from('tasks')
    .update({ status })
    .eq('id', taskId)
    .select()
    .single()
  return { data: data as Task, error }
}

/**
 * ACTIVITY
 */
export async function getTaskActivity(taskId: string) {
  const { data, error } = await supabase
    .from('task_activity')
    .select('*')
    .eq('task_id', taskId)
    .order('created_at', { ascending: true })
  return { data: data as TaskActivity[], error }
}

export async function addTaskNote(taskId: string, content: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('task_activity')
    .insert([{ 
      task_id: taskId, 
      type: 'note', 
      content, 
      author_id: user.id 
    }])
    .select()
    .single()
  return { data: data as TaskActivity, error }
}
