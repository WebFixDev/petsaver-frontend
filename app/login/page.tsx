'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Mail, Lock, ArrowRight, PawPrint, Sparkles, 
  ShieldAlert, Eye, EyeOff, X 
} from 'lucide-react';
import { loginAdminAction } from '@/actions/auth'; 

export default function Login() {
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Naya state password hide/show ke liye
  const [showPassword, setShowPassword] = useState(false);

  // Error Popup ko 5 seconds baad khud gayab karne ke liye
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await loginAdminAction(email, password);

    if (result.success) {
      router.push('/admin/users');
    } else {
      setError(result.error || 'Invalid email or password.');
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fefaf5] text-gray-900 selection:bg-yellow-200 font-sans flex flex-col relative">
      <Navbar />

      {/* 🚨 Modern Error Popup (Toast) */}
      {error && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 transition-all animate-in fade-in slide-in-from-top-10">
          <ShieldAlert size={20} className="shrink-0" />
          <p className="font-bold text-sm">{error}</p>
          <button 
            onClick={() => setError('')} 
            className="p-1 hover:bg-red-700 rounded-full transition-colors ml-2"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <section className="flex-grow flex items-center justify-center px-6 py-20 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-20 left-10 opacity-20 rotate-12 pointer-events-none hidden lg:block">
          <PawPrint size={150} className="text-yellow-500" />
        </div>
        <div className="absolute bottom-20 right-10 opacity-20 -rotate-12 pointer-events-none hidden lg:block">
          <MessageSquare size={150} className="text-yellow-500" />
        </div>

        <div className="max-w-lg w-full relative z-10">
          <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
            
            {/* Header */}
            <div className="bg-yellow-500 p-10 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-20 translate-x-4 -translate-y-4">
                <Sparkles size={80} className="text-white" />
              </div>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4 text-yellow-600">
                <PawPrint size={32} />
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight">Welcome Back!</h1>
              <p className="text-yellow-100 font-medium mt-1">Ready to access Mazito Admin?</p>
            </div>

            {/* Form */}
            <div className="p-10 lg:px-12">
              <form onSubmit={handleLogin} className="space-y-6">
                
                {/* Email Input */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-yellow-500 transition-colors">
                      <Mail size={18} />
                    </div>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@mazito.io"
                      className="w-full pl-12 pr-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
                    />
                  </div>
                </div>

                {/* Password Input (With Eye Icon) */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-yellow-500 transition-colors">
                      <Lock size={18} />
                    </div>
                    <input 
                      // Toggle type based on state
                      type={showPassword ? "text" : "password"} 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
                    />
                    {/* Eye Toggle Button */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Login Button */}
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-lg hover:bg-black transition-all flex items-center justify-center gap-2 mt-4 shadow-lg shadow-gray-200 disabled:opacity-80 active:scale-[0.98]"
                >
                  {isLoading ? 'Signing in...' : (
                    <>Sign In <ArrowRight size={20} className="text-yellow-500" /></>
                  )}
                </button>

              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

// Simple placeholder for missing icon in local scope
function MessageSquare({ size, className }: { size: number, className: string }) {
  return (
    <svg 
      width={size} height={size} viewBox="0 0 24 24" fill="none" 
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
      className={className}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  );
}