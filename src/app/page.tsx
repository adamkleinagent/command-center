'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { TaskList } from "@/components/TaskList";
import { TaskDetail } from "@/components/TaskDetail";
import { Project, Task } from '@/lib/types';
import { signIn, getSession } from "@/lib/auth";
import { getProjects, getTasks } from "@/lib/data";

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
             <h1 className="text-2xl font-bold tracking-tight">AdamOS</h1>
             <p className="text-zinc-500 text-xs font-medium uppercase tracking-[0.2em] mt-1">Command Center</p>
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
            Create new partner account
          </Link>
        </form>
      </div>
    );
  }

  // Main Layout - Apple Pro Style
  return (
    <div className="flex h-screen bg-black font-sans text-zinc-100 overflow-hidden selection:bg-indigo-500/30">
      {/* 1. Sidebar (Navigation) */}
      <Sidebar 
        projects={projects}
        activeProject={activeProjectId} 
        onSelectProject={setActiveProjectId}
        onProjectCreated={handleProjectCreated}
        userEmail={user?.email}
      />

      {/* 2. Task List (Workboard) */}
      <TaskList 
        tasks={tasks}
        projects={projects}
        activeProjectId={activeProjectId}
        activeTask={activeTask}
        onSelectTask={setActiveTask}
        onTaskCreated={handleTaskCreated}
      />

      {/* 3. Detail Panel (Context) */}
      {activeTask && (
        <TaskDetail 
          task={activeTask} 
          onClose={() => setActiveTask(null)}
          onUpdate={handleTaskUpdated}
        />
      )}
    </div>
  );
}
