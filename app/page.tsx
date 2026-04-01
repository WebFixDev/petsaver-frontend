import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Music, ShieldAlert, HeartOff, CalendarCheck, MessageSquare, 
  PlayCircle, Smartphone, Star, Users, ArrowRight, CheckCircle2, 
  ChevronDown, Heart
} from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fefaf5] text-gray-900 selection:bg-yellow-200 font-sans">
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <section className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between py-12 lg:py-24 gap-12 overflow-hidden">
        <div className="flex-1 space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-sm font-bold uppercase tracking-wider shadow-sm">
            <Music size={14} className="animate-pulse" /> New — Trending Pet Videos
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight">
            Welcome to <span className="text-yellow-500 italic relative whitespace-nowrap">
              Mazito Social
              <svg className="absolute w-full h-4 -bottom-1 left-0 text-yellow-300 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 15 100 5" stroke="currentColor" strokeWidth="8" fill="transparent"/></svg>
            </span> <br /> for Pets!
          </h1>
          
          <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
            Join the wildest pet community. Short videos, live chats, and the cutest hamster & dog content. Find your tribe, share joy.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button className="px-8 py-4 bg-yellow-500 text-white rounded-full font-bold text-lg shadow-lg shadow-yellow-200 hover:bg-yellow-600 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
              <Smartphone size={20} /> Get the App
            </button>
            <button className="px-8 py-4 border-2 border-yellow-200 text-yellow-700 rounded-full font-bold text-lg hover:border-yellow-500 hover:bg-yellow-50 transition-all flex items-center justify-center gap-2">
              <PlayCircle size={20} /> Explore Feed
            </button>
          </div>

          {/* <div className="bg-white p-4 rounded-3xl flex items-center justify-between border border-yellow-100 shadow-md max-w-md">
            <span className="flex items-center gap-3 text-gray-800 font-bold">
              <div className="bg-red-100 p-2 rounded-xl text-red-500"><ShieldAlert size={20} /></div>
              Panic? Mazito Cares.
            </span>
            <button className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold shadow-sm hover:bg-red-500 hover:text-white transition-all text-sm">
              Panic Mode
            </button>
          </div> */}
        </div>

        <div className="flex-1 flex justify-center lg:justify-end relative">
          <div className="absolute top-10 -left-10 w-32 h-32 bg-yellow-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob"></div>
          <div className="absolute top-10 -right-10 w-32 h-32 bg-orange-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000"></div>
          
          <div className="relative group z-10">
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-[3.5rem] blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
            <div className="relative w-[300px] h-[600px] bg-gray-900 rounded-[3.5rem] p-3 border-[6px] border-gray-800 shadow-2xl overflow-hidden">
              <div className="w-full h-full bg-[#1e1e24] rounded-[2.5rem] flex flex-col items-center justify-center text-center relative overflow-hidden">
                 {/* Fake Video Background */}
                 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&q=80&w=600')] bg-cover bg-center opacity-60"></div>
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                 
                 <div className="absolute bottom-6 left-4 text-left text-white space-y-2 z-10">
                   <div className="font-bold text-lg flex items-center gap-2">@HamsterHero <Heart size={16} className="text-yellow-500 fill-yellow-500" /></div>
                   <p className="text-sm opacity-90">Parkour Hamster doing backflips! 🔥 #MazitoTok</p>
                   <div className="flex items-center gap-2 text-xs opacity-75 mt-2">
                     <Music size={12} /> Original Audio - Pet Vibes
                   </div>
                 </div>
                 
                 <div className="absolute right-4 bottom-12 flex flex-col gap-6 text-white z-10">
                   <div className="flex flex-col items-center gap-1"><Heart size={28} /> <span className="text-xs font-bold">12.4K</span></div>
                   <div className="flex flex-col items-center gap-1"><MessageSquare size={28} /> <span className="text-xs font-bold">892</span></div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS BANNER ================= */}
      <section className="bg-yellow-500 py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-yellow-400">
          <div className="space-y-1">
            <h3 className="text-4xl font-black text-white">2M+</h3>
            <p className="text-yellow-100 font-medium">Pet Lovers</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-4xl font-black text-white">50M+</h3>
            <p className="text-yellow-100 font-medium">Videos Shared</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-4xl font-black text-white">10k+</h3>
            <p className="text-yellow-100 font-medium">Daily Playdates</p>
          </div>
          <div className="space-y-1 flex flex-col items-center justify-center">
            <div className="flex text-white mb-1">
              {[...Array(5)].map((_, i) => <Star key={i} size={24} fill="currentColor" />)}
            </div>
            <p className="text-yellow-100 font-medium">4.9/5 Rating</p>
          </div>
        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-extrabold mb-4">Everything your pet needs, <br/> <span className="text-yellow-500">all in one place.</span></h2>
          <p className="text-gray-600 text-lg">From zero-panic safety features to smart scheduling, Mazito is designed to make pet parenting joyful and stress-free.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: <HeartOff size={32} />, title: "Zero Panic System", desc: "No panic in Mazito! One click sends safety resources instantly to your emergency contacts." },
            { icon: <CalendarCheck size={32} />, title: "Smart Scheduling", desc: "Schedule feeding & playtime. Get meal prep reminders easily so you never miss a beat." },
            { icon: <MessageSquare size={32} />, title: "Live Chatrooms", desc: "Real-time pet-parent chats, meetups, and trending topics. Connect with your local community." }
          ].map((f, i) => (
            <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 hover:shadow-yellow-100 transition-all hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-yellow-500 group-hover:text-white transition-colors">
                {f.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3">{f.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-6">{f.desc}</p>
              <button className="font-bold text-yellow-600 flex items-center gap-1 hover:gap-2 transition-all">
                Learn more <ArrowRight size={18} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ================= APP SHOWCASE / HOW IT WORKS ================= */}
      <section className="bg-white py-24 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <h2 className="text-4xl font-extrabold">Connect with a <span className="text-yellow-500 underline decoration-wavy">Wise Community</span></h2>
            <p className="text-lg text-gray-600">
              Dogs are human's best friends, but are you a dog's best friend? Mazito helps you understand your pets better through shared experiences.
            </p>
            <ul className="space-y-4">
              {['Upload short-form pet videos', 'Join live audio rooms with vets', 'Find playdates in your neighborhood'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-800 font-medium text-lg">
                  <CheckCircle2 className="text-yellow-500" /> {item}
                </li>
              ))}
            </ul>
            <button className="px-8 py-4 bg-gray-900 text-white rounded-full font-bold shadow-lg hover:bg-gray-800 transition-all">
              Join the Community
            </button>
          </div>
          
          <div className="flex-1 w-full bg-[#fefaf5] rounded-[3rem] p-8 lg:p-12 relative border border-yellow-100">
             {/* Abstract Chat Bubbles Showcase */}
             <div className="space-y-6 relative z-10">
                <div className="bg-white p-5 rounded-2xl rounded-tl-sm shadow-md border border-gray-50 max-w-[80%]">
                  <p className="text-gray-800 font-medium">"Has anyone tried the new organic hamster treats from the Mazito store?" 🐹</p>
                  <span className="text-xs text-gray-400 mt-2 block">Sarah & Mochi • 2 mins ago</span>
                </div>
                <div className="bg-yellow-500 p-5 rounded-2xl rounded-tr-sm shadow-md shadow-yellow-200 text-white max-w-[80%] ml-auto">
                  <p className="font-medium">"Yes! My golden retriever loves them. I just posted a feeding schedule guide in the blog! 📅"</p>
                  <span className="text-xs text-yellow-100 mt-2 block">You • Just now</span>
                </div>
                <div className="bg-white p-5 rounded-2xl rounded-tl-sm shadow-md border border-gray-50 max-w-[80%]">
                  <p className="text-gray-800 font-medium">"Setting a reminder right now using the app feature. Thanks!" 🐾</p>
                  <span className="text-xs text-gray-400 mt-2 block">Dr. Maya • 1 min ago</span>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* ================= FAQ SECTION ================= */}
      <section className="max-w-4xl mx-auto px-6 py-24">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold mb-4">Got Questions?</h2>
          <p className="text-gray-600">Everything you need to know about Mazito Social.</p>
        </div>
        <div className="space-y-4">
          {[
            "How do I join Mazito Social?",
            "Can I post videos of any pet?",
            "Is the panic mode actually anonymous?",
            "How does the smart scheduling work?"
          ].map((q, i) => (
            <div key={i} className="p-6 bg-white border-2 border-gray-100 rounded-2xl hover:border-yellow-500 transition-colors cursor-pointer flex justify-between items-center group shadow-sm hover:shadow-md">
              <span className="text-lg font-bold text-gray-800">{q}</span>
              <ChevronDown className="text-gray-400 group-hover:text-yellow-500 transition-colors" />
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <p className="text-gray-500">Still have questions? <a href="#" className="text-yellow-500 font-bold hover:underline">Visit our Help Center</a></p>
        </div>
      </section>

      {/* ================= BOTTOM CTA ================= */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden shadow-2xl shadow-yellow-200">
          <div className="absolute top-0 right-0 opacity-10 rotate-12 -translate-y-10 pointer-events-none">
            <Music size={300} />
          </div>
          <h2 className="text-4xl lg:text-6xl font-black text-white mb-6 relative z-10">Ready to Go Viral?</h2>
          <p className="text-yellow-50 text-xl font-medium mb-10 max-w-2xl mx-auto relative z-10">
            Your pet's fame starts here. Download Mazito Social, join the community, and let the world see how awesome your furry friend is.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            {/* <button className="bg-gray-900 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-black transition-all hover:scale-105 duration-200">
              Download for iOS
            </button> */}
            <button className="bg-white text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-50 transition-all hover:scale-105 duration-200">
              Download for Android
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}