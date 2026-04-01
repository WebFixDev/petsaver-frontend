import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Heart, ShieldCheck, Users, Sparkles, PawPrint, 
  Camera, Globe, Activity 
} from 'lucide-react';

export default function AboutUs() {
  return (
    <main className="min-h-screen bg-[#fefaf5] text-gray-900 selection:bg-yellow-200 font-sans">
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-24 pb-32 px-6 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 inset-x-0 h-full bg-gradient-to-b from-yellow-50 to-[#fefaf5] -z-10"></div>
        <div className="absolute top-20 -left-20 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
        <div className="absolute top-40 -right-20 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-100 text-yellow-800 rounded-full text-sm font-bold uppercase tracking-wider shadow-sm mb-6">
            <Heart size={14} className="text-yellow-500 fill-yellow-500" /> Our Story
          </div>
          <h1 className="text-5xl lg:text-7xl font-black mb-6 tracking-tight text-gray-900">
            For the love of <span className="text-yellow-500 italic">Paws</span>, <br /> Claws, & Whiskers.
          </h1>
          <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed">
            Mazito Social isn't just an app. It's a global movement to celebrate the purest connections in our lives—the ones we share with our pets.
          </p>
        </div>
      </section>

      {/* ================= THE ORIGIN STORY ================= */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-white rounded-[3.5rem] shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100 flex flex-col lg:flex-row items-center">
          
          <div className="lg:w-1/2 p-10 lg:p-16 space-y-6">
            <h2 className="text-4xl font-black text-gray-900">How Mazito Began</h2>
            <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
              <p>
                Social media has become noisy. Between the news, the influencers, and the endless human drama, we realized something was missing: a pure, dedicated space for the content that actually makes us smile. 
              </p>
              <p>
                Led by Faisal and a passionate team of engineers, Mazito was born out of a simple idea: <strong>What if pets had their own TikTok?</strong> A place where a hamster doing parkour, a golden retriever's morning stretch, or a parrot singing could go viral without competing with human politics.
              </p>
              <p>
                But we wanted to build more than just an entertainment feed. We wanted a supportive community. That's why we integrated real-world utility like the smart feeding scheduler and our signature <strong>Panic Mode</strong>—because pet parenting is a journey, and no one should walk it alone.
              </p>
            </div>
          </div>

          <div className="lg:w-1/2 bg-yellow-500 h-full min-h-[400px] lg:min-h-[600px] relative flex items-center justify-center p-10">
            {/* Abstract Graphic representing connection */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div className="relative z-10 text-center text-white space-y-6">
              <div className="w-32 h-32 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto border border-white/30 shadow-2xl">
                <PawPrint size={64} className="text-white" />
              </div>
              <h3 className="text-3xl font-black italic">"Every pet has a story."</h3>
            </div>
          </div>

        </div>
      </section>

      {/* ================= OUR CORE VALUES ================= */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-black mb-4">Our Mission & Values</h2>
          <p className="text-gray-600 text-lg">We are guided by three simple principles to ensure Mazito remains the best place on the internet.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { 
              icon: <Sparkles size={32} />, 
              title: "Unfiltered Joy", 
              desc: "We believe in the therapeutic power of pet videos. Our algorithm is optimized for smiles, laughs, and wholesome moments." 
            },
            { 
              icon: <ShieldCheck size={32} />, 
              title: "Absolute Safety", 
              desc: "From strict anti-cruelty guidelines to our built-in Panic Mode, we prioritize the physical and mental well-being of both pets and owners." 
            },
            { 
              icon: <Globe size={32} />, 
              title: "Community First", 
              desc: "Whether you're asking for diet advice or setting up a playdate, Mazito is designed to connect you with wise, like-minded pet parents." 
            }
          ].map((val, i) => (
            <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-lg hover:shadow-xl transition-shadow group">
              <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-yellow-500 group-hover:text-white transition-colors duration-300">
                {val.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3">{val.title}</h3>
              <p className="text-gray-600 leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FOUNDER'S NOTE / TEAM ================= */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="bg-gray-900 rounded-[3rem] p-10 lg:p-16 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
            <Activity size={400} className="absolute -top-20 -left-20" />
          </div>
          
          <div className="relative z-10 space-y-8">
            <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-yellow-500/30">
              <Camera size={32} className="text-white" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-black text-white">"We didn't just build an app; we built a digital park."</h2>
            <p className="text-xl text-gray-400 font-medium max-w-3xl mx-auto leading-relaxed italic">
              "Pets don't care about our jobs, our backgrounds, or our bank accounts. They just want to play, love, and be loved. Mazito is our attempt to bring that exact same energy to the digital world. Thank you for being a part of this journey."
            </p>
            <div className="pt-4">
              <p className="text-white font-bold text-lg">Muhammad Faisal</p>
              <p className="text-yellow-500 font-medium">Lead Engineer & Visionary, Mazito</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}