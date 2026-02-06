'use client';

import { useState, useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("cc_auth");
    if (auth === "hesloheslo123") {
      setIsAuthenticated(true);
    }
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
        <form onSubmit={handleLogin} className="flex flex-col gap-4 p-8 border border-zinc-800 rounded-lg">
          <h1 className="text-xl font-bold">Adam Klein Command Center</h1>
          <input
            type="password"
            placeholder="Zadaj heslo"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 bg-zinc-900 border border-zinc-700 rounded text-white outline-none focus:border-white"
          />
          <button type="submit" className="bg-white text-black p-2 rounded font-bold hover:bg-zinc-200 transition">
            Vstúpiť
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-4xl font-bold leading-10 tracking-tight text-black dark:text-zinc-50">
            🦾 Command Center
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Vitaj v operačnom centre. Tu budeme spravovať projekty, tasky a moju integráciu.
          </p>
          <div className="mt-4 p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-900 w-full">
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Aktuálny stav</h2>
            <ul className="text-sm space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>✅ GitHub Repozitár pripojený</li>
              <li>⏳ Supabase integrácia (v príprave)</li>
              <li>⏳ Dashbord UI (v príprave)</li>
            </ul>
          </div>
        </div>
        
        <footer className="w-full pt-8 border-t border-zinc-100 dark:border-zinc-900 text-xs text-zinc-500">
          Adam Klein Agent v0.1 | 2026
        </footer>
      </main>
    </div>
  );
}
