'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "@/lib/auth";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signUp(email, password);
    if (error) {
      alert(error.message);
    } else {
      alert("Registration successful! Check your email for a confirmation link.");
      router.push("/");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black font-sans text-white px-4">
      <div className="flex flex-col gap-4 p-8 border border-zinc-900 rounded-2xl w-full max-w-sm bg-zinc-950 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
           <div className="text-5xl mb-4 grayscale hover:grayscale-0 transition-all cursor-default">🦾</div>
           <h1 className="text-2xl font-bold tracking-tight">Join AdamOS</h1>
           <p className="text-zinc-500 text-xs font-medium uppercase tracking-[0.2em] mt-1">Create Partner Account</p>
        </div>
        
        <form onSubmit={handleSignUp} className="flex flex-col gap-4">
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
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white outline-none focus:border-indigo-500 transition-all text-sm"
              required
              minLength={6}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="mt-2 bg-white text-black hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-500 p-3 rounded-xl font-bold transition-all shadow-lg active:scale-[0.98]"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center mt-4">
          <Link href="/" className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 hover:text-zinc-400 transition-colors">
            Already have an account? Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
