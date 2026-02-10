'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { TaskList } from "@/components/TaskList";
import { TaskDetail } from "@/components/TaskDetail";
import { MobileNav } from "@/components/MobileNav";
import { Project, Task } from '@/lib/types';
import { signIn, getSession } from "@/lib/auth";
import { getProjects, getTasks } from "@/lib/data";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  // App State
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeProjectId, setActiveProjectId] = useState('all');
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  
  // Mobile state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'tasks' | 'dashboard'>('tasks');

  // Fix hydration mismatch + auth check
  useEffect(() => {
    setIsClient(true);
    
    const checkAuth = async () => {
      const { session } = await getSession();
      if (session) {
        setIsAuthenticated(true);
        setUser(session.user);
        loadInitialData();
      }
    };
    
    checkAuth();
  }, []);

  // Reload data when project changes
  useEffect(() => {
    if (isAuthenticated) {
      loadTasks();
    }
  }, [activeProjectId, isAuthenticated]);

  // Realtime Subscriptions
  useEffect(() => {
    if (!isAuthenticated) return;

    const projectsChannel = supabase
      .channel('projects_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        loadInitialData();
      })
      .subscribe();

    const tasksChannel = supabase
      .channel('tasks_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => {
        loadTasks();
      })
      .subscribe();

    const activityChannel = supabase
      .channel('activity_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'task_activity' }, (payload) => {
        if (activeTask && (payload.new as any).task_id === activeTask.id) {
          loadTasks(); 
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(projectsChannel);
      supabase.removeChannel(tasksChannel);
      supabase.removeChannel(activityChannel);
    };
  }, [isAuthenticated, activeProjectId, activeTask?.id]);

  // Close sidebar when selecting project on mobile
  const handleSelectProject = (id: string) => {
    setActiveProjectId(id);
    setSidebarOpen(false);
  };

  // Close detail when clicking task on mobile
  const handleSelectTask = (task: Task) => {
    setActiveTask(task);
  };

  const loadInitialData = async () => {
    const { data } = await getProjects();
    if (data) setProjects(data);
  };

  const loadTasks = async () => {
    const { data } = await getTasks(activeProjectId === 'all' ? undefined : activeProjectId);
    if (data) setTasks(data);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await signIn(email, password);
    if (error) {
      alert(error.message);
    } else if (data.session) {
      setIsAuthenticated(true);
      setUser(data.session.user);
      loadInitialData();
    }
    
    setLoading(false);
  };

  const handleProjectCreated = (project: Project) => {
    setProjects([project, ...projects]);
    setActiveProjectId(project.id);
    setSidebarOpen(false);
  };

  const handleTaskCreated = (task: Task) => {
    setTasks([task, ...tasks]);
    setActiveTask(task);
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
    setActiveTask(updatedTask);
  };

  // Prevent flash of content or hydration mismatch
  if (!isClient) return null;

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black font-sans text-white px-4">
        <form onSubmit={handleLogin} className="flex flex-col gap-4 p-8 border border-zinc-900 rounded-2xl w-full max-w-sm bg-zinc-950 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
             <div className="text-5xl mb-4 grayscale hover:grayscale-0 transition-all cursor-default">🦾</div>
             <h1 className="text-2xl font-bold tracking-tight">Command Center</h1>
             <p className="text-zinc-500 text-[9px] font-bold uppercase tracking-[0.3em] mt-2">AI Task Management</p>
          </div>
          
          <div className="space-y-2">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white outline-none focus:border-indigo-500 transition-all text-sm"
              required
            />
            
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white outline-none focus:border-indigo-500 transition-all text-sm"
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="mt-2 bg-white text-black hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-500 p-3 rounded-xl font-bold transition-all shadow-lg active:scale-[0.98]"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>

          <Link href="/signup" className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 hover:text-zinc-400 transition-colors text-center mt-4">
            Create new account
          </Link>
        </form>
      </div>
    );
  }

  // Main Layout - Responsive
  return (
    <div className="flex h-screen bg-black font-sans text-zinc-100 overflow-hidden selection:bg-indigo-500/30">
      {/* Mobile Navigation */}
      <MobileNav 
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        projectName={activeProjectId === 'all' ? 'All Tasks' : projects.find(p => p.id === activeProjectId)?.name || 'Tasks'}
      />

      {/* Sidebar - Hidden on mobile unless open */}
      <div className={`
        fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar 
          projects={projects}
          activeProject={activeProjectId} 
          onSelectProject={handleSelectProject}
          onProjectCreated={handleProjectCreated}
          userEmail={user?.email}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row pt-14 md:pt-0">
        {/* Task List */}
        <TaskList 
          tasks={tasks}
          projects={projects}
          activeProjectId={activeProjectId}
          activeTask={activeTask}
          onSelectTask={handleSelectTask}
          onTaskCreated={handleTaskCreated}
        />

        {/* Detail Panel - Full screen on mobile when active */}
        {activeTask && (
          <div className={`
            fixed inset-0 z-50 md:relative md:inset-auto
            md:w-[450px] lg:w-[550px]
          `}>
            <TaskDetail 
              task={activeTask} 
              onClose={() => setActiveTask(null)}
              onUpdate={handleTaskUpdated}
            />
          </div>
        )}
      </div>
    </div>
  );
}
