'use client';

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TaskList } from "@/components/TaskList";
import { TaskDetail } from "@/components/TaskDetail";
import { Task } from '@/lib/mock-data';
import { signIn, signUp, getSession } from "@/lib/auth";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeProject, setActiveProject] = useState('p1');
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Fix hydration mismatch + auth check
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
    
    const checkAuth = async () => {
      const { session } = await getSession();
      if (session) {
        setIsAuthenticated(true);
      }
    };
    
    checkAuth();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      const { error } = await signUp(email, password);
      if (error) {
        alert(error.message);
      } else {
        alert("Check your email for confirmation!");
      }
    } else {
      const { data, error } = await signIn(email, password);
      if (error) {
        alert(error.message);
      } else if (data.session) {
        setIsAuthenticated(true);
      }
    }
    setLoading(false);
  };

  // Prevent flash of content or hydration mismatch
  if (!isClient) return null;

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black font-sans text-white">
        <form onSubmit={handleAuth} className="flex flex-col gap-4 p-8 border border-zinc-800 rounded-lg w-80">
          <div className="flex flex-col items-center mb-4">
             <div className="text-4xl mb-2">🦾</div>
             <h1 className="text-xl font-bold">AdamOS</h1>
             <p className="text-zinc-500 text-xs">Command Center Access</p>
          </div>
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 bg-zinc-900 border border-zinc-700 rounded text-white outline-none focus:border-indigo-500 transition"
            required
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 bg-zinc-900 border border-zinc-700 rounded text-white outline-none focus:border-indigo-500 transition"
            required
          />
          
          <button 
            type="submit" 
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-700 text-white p-2 rounded font-bold transition"
          >
            {loading ? "Processing..." : (isSignUp ? "Sign Up" : "Enter")}
          </button>

          <button 
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-zinc-500 hover:text-zinc-300 transition text-center"
          >
            {isSignUp ? "Already have an account? Log in" : "Need an account? Sign up"}
          </button>
        </form>
      </div>
    );
  }

  // Main Layout
  return (
    <div className="flex h-screen bg-black font-sans text-zinc-100 overflow-hidden">
      {/* 1. Sidebar (Navigation) */}
      <Sidebar 
        activeProject={activeProject} 
        onSelectProject={setActiveProject} 
      />

      {/* 2. Task List (Workboard) */}
      <TaskList 
        activeTask={activeTask}
        onSelectTask={setActiveTask}
      />

      {/* 3. Detail Panel (Context) */}
      {activeTask && (
        <TaskDetail 
          task={activeTask} 
          onClose={() => setActiveTask(null)} 
        />
      )}
    </div>
  );
}
