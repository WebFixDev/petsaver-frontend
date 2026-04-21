'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PawPrint, Menu, X, UserCircle } from 'lucide-react'; // UserCircle icon add kiya

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about-us' },
    { name: 'Contact Us', href: '/contact-us' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* --- LOGO --- */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 text-white rounded-2xl bg-linear-to-br from-yellow-400 to-yellow-600 shadow-lg shadow-yellow-200">
            <PawPrint size={24} />
          </div>
          <span className="text-2xl font-extrabold tracking-tight bg-linear-to-r from-gray-900 to-yellow-600 bg-clip-text text-transparent">
            Mazito Social
          </span>
        </Link>

        {/* --- DESKTOP MENU --- */}
        <div className="hidden md:flex items-center gap-8 font-semibold text-gray-700">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className="hover:text-yellow-500 transition-colors"
            >
              {link.name}
            </Link>
          ))}
          
          {/* ✅ DESKTOP LOGIN BUTTON */}
          <div className="h-6 w-px bg-gray-200 mx-2"></div> {/* Separator Line */}
          <Link 
            href="/login" 
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-black transition-all hover:scale-105 active:scale-95 font-bold shadow-md shadow-gray-200"
          >
            <UserCircle size={18} className="text-yellow-500" />
            Login
          </Link>
        </div>

        {/* --- MOBILE MENU BUTTON --- */}
        <button 
          className="md:hidden text-gray-700 hover:text-yellow-500 focus:outline-none transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* --- MOBILE DROPDOWN MENU --- */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl shadow-gray-200/20">
          <div className="flex flex-col px-6 py-6 space-y-6 font-semibold text-gray-700 text-lg">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="hover:text-yellow-500 transition-colors"
                onClick={() => setIsOpen(false)} 
              >
                {link.name}
              </Link>
            ))}
            
            {/* ✅ MOBILE LOGIN BUTTON */}
            <div className="pt-4 border-t border-gray-100">
              <Link 
                href="/login" 
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-gray-900 text-white rounded-xl hover:bg-black transition-all font-bold"
                onClick={() => setIsOpen(false)}
              >
                <UserCircle size={20} className="text-yellow-500" />
                Login to Admin
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}