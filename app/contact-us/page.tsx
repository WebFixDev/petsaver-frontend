'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, Send, MessageSquare, PawPrint, Sparkles } from 'lucide-react';

export default function ContactUs() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Fake API call simulation
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-[#fefaf5] text-gray-900 selection:bg-yellow-200 font-sans">
      <Navbar />

      {/* --- HEADER SECTION --- */}
      <section className="bg-yellow-500 pt-20 pb-32 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 rotate-12 -translate-y-10 pointer-events-none">
          <MessageSquare size={400} />
        </div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-400 text-yellow-900 rounded-full text-sm font-bold uppercase tracking-wider shadow-sm mb-6">
            <Sparkles size={14} /> We're all ears
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-white mb-6 tracking-tight">
            Let's Get in Touch! <PawPrint className="inline-block mb-4 text-yellow-800" size={48} />
          </h1>
          <p className="text-yellow-100 text-xl font-medium max-w-2xl mx-auto">
            Have questions about Mazito Social, need help with your account, or just want to share feedback? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* --- CONTACT LAYOUT --- */}
      <section className="max-w-6xl mx-auto px-6 -mt-20 relative z-20 pb-24">
        <div className="bg-white rounded-[3rem] shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100 flex flex-col lg:flex-row">
          
          {/* Left Side: Contact Information */}
          <div className="bg-gray-900 text-white p-10 lg:p-14 lg:w-2/5 relative overflow-hidden flex flex-col">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
               {/* Abstract pattern / background */}
               <div className="absolute -right-10 -top-10 w-64 h-64 bg-yellow-500 rounded-full blur-3xl"></div>
               <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-orange-500 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 flex-grow">
              <h2 className="text-3xl font-black mb-2">Contact Information</h2>
              <p className="text-gray-400 mb-10">Fill up the form and our Team will get back to you within 24 hours.</p>

              <div className="space-y-8">
                <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-12 h-12 bg-gray-800 text-yellow-500 rounded-full flex items-center justify-center group-hover:bg-yellow-500 group-hover:text-gray-900 transition-colors">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-medium">Email Us</p>
                    <p className="text-lg font-bold">support@mazito.io</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Added a small decorative element to balance the empty space at the bottom */}
            <div className="relative z-10 mt-auto pt-16 opacity-50">
               <PawPrint size={64} className="text-gray-800" />
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="p-10 lg:p-14 lg:w-3/5 bg-white">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">First Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="John" 
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Last Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Doe" 
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Email Address</label>
                  <input 
                    type="email" 
                    required
                    placeholder="john@example.com" 
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Phone Number (Optional)</label>
                  <input 
                    type="tel" 
                    placeholder="+1 (555) 000-0000" 
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Subject</label>
                <select className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all appearance-none">
                  <option>General Inquiry</option>
                  <option>App Support & Bug Report</option>
                  <option>Partnership & Collab</option>
                  <option>Feedback & Suggestions</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Message</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Tell us how we can help..." 
                  className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all resize-none"
                ></textarea>
              </div>

              <div className="pt-2">
                {isSubmitted ? (
                  <div className="w-full py-4 bg-green-50 text-green-600 rounded-2xl font-bold flex items-center justify-center gap-2 border border-green-200">
                    <Sparkles size={20} /> Message sent successfully! We'll reply soon.
                  </div>
                ) : (
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full py-4 bg-yellow-500 text-white rounded-2xl font-bold text-lg hover:bg-yellow-600 hover:shadow-lg hover:shadow-yellow-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Sending...' : (
                      <>Send Message <Send size={20} /></>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}