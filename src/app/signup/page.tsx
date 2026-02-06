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
    <div className="flex min-h-screen items-center justify-center bg-black font-sans text-white">
      <div className="flex flex-col gap-4 p-8 border border-zinc-800 rounded-lg w-80">
        <div className="flex flex-col items-center mb-4">
           <div className="text-4xl mb-2">🦾</div>
           <h1 className="text-xl font-bold">Join AdamOS</h1>
           <p className="text-zinc-500 text-xs">Create your partner account</p>
        </div>
        
        <form onSubmit={handleSignUp} className="flex flex-col gap-4">
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
            minLength={6}
          />
          
          <button 
            type="submit" 
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-700 text-white p-2 rounded font-bold transition"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center mt-2">
          <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300 transition">
            Already have an account? Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
