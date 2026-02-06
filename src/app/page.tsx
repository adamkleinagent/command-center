'use client';

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TaskList } from "@/components/TaskList";
import { TaskDetail } from "@/components/TaskDetail";
import { MOCK_TASKS } from '@/lib/mock-data';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeProject, setActiveProject] = useState('p1');
  const [activeTask, setActiveTask] = useState<any>(null);

  // Auth Logic (Simple)
  useEffect(() => {
    const auth = localStorage.getItem("cc_auth");
    if (auth === "hesloheslo123") setIsAuthenticated(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "hesloheslo123") {
      localStorage.setItem("cc_auth", "hesloheslo123");
      setIsAuthenticated(true);
    } else {
      alert("Nesprávne heslo.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black font-sans text-white">
        <form onSubmit={handleLogin} className="flex flex-col gap-4 p-8 border border-zinc-800 rounded-lg w-80">
          <div className="flex flex-col items-center mb-4">
             <div className="text-4xl mb-2">🦾</div>
             <h1 className="text-xl font-bold">AdamOS</h1>
             <p className="text-zinc-500 text-xs">Command Center Access</p>
          </div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 bg-zinc-900 border border-zinc-700 rounded text-white outline-none focus:border-indigo-500 transition text-center"
          />
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded font-bold transition">
            Enter
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
