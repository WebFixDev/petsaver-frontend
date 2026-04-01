import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShieldCheck, Eye, Database, Lock, UserCheck, Mail } from 'lucide-react';

export default function PrivacyPolicy() {
  const lastUpdated = "March 31, 2026";

  return (
    <main className="min-h-screen bg-[#fefaf5] text-gray-900 selection:bg-yellow-200 font-sans">
      <Navbar />

      {/* --- HEADER SECTION --- */}
      <section className="bg-yellow-500 pt-20 pb-32 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 rotate-12 -translate-y-10 pointer-events-none">
          <ShieldCheck size={400} />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-400 text-yellow-900 rounded-full text-sm font-bold uppercase tracking-wider shadow-sm mb-6">
            <Lock size={14} /> Safe & Secure
          </div>
          <h1 className="text-5xl lg:text-6xl font-black text-white mb-6">Privacy Policy</h1>
          <p className="text-yellow-100 text-xl font-medium max-w-2xl mx-auto">
            At Mazito Social, we care about your privacy as much as you care about your pets. Here is how we protect your data.
          </p>
          <p className="text-yellow-200 mt-6 font-medium">Last Updated: {lastUpdated}</p>
        </div>
      </section>

      {/* --- CONTENT SECTION --- */}
      <section className="max-w-4xl mx-auto px-6 -mt-20 relative z-20 pb-24">
        <div className="bg-white rounded-[3rem] shadow-xl shadow-gray-200/50 p-8 lg:p-14 border border-gray-100">
          
          <div className="space-y-12 text-lg text-gray-600 leading-relaxed">
            
            {/* Introduction */}
            <div>
              <p>
                Welcome to <strong>Mazito Social</strong>. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our mobile application and website. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application.
              </p>
            </div>

            {/* Section 1 */}
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <Database className="text-yellow-500" /> 1. Information We Collect
              </h2>
              <p>We may collect information about you in a variety of ways. The information we may collect includes:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 marker:text-yellow-500">
                <li><strong>Personal Data:</strong> Demographics and other personally identifiable information (such as your name and email address) that you voluntarily give to us when registering for the app.</li>
                <li><strong>Pet Profiles:</strong> Information about your pets, including names, breeds, feeding schedules, and photos/videos you upload.</li>
                <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the app, such as your IP address, your browser type, your operating system, and your access times.</li>
              </ul>
            </div>

            {/* Section 2 */}
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <Eye className="text-yellow-500" /> 2. How We Use Your Information
              </h2>
              <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 marker:text-yellow-500">
                <li>Create and manage your account and your pet's profile.</li>
                <li>Deliver targeted advertising, coupons, newsletters, and other information regarding promotions to you.</li>
                <li>Enable user-to-user communications and live chatrooms.</li>
                <li>Operate the <strong>Panic Mode</strong> feature effectively to ensure your safety by notifying your designated emergency contacts.</li>
                <li>Send you reminders for pet feeding and scheduling.</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <UserCheck className="text-yellow-500" /> 3. Sharing of Your Information
              </h2>
              <p>We value your trust. We do <strong>not</strong> sell your personal data to third parties. We may share information we have collected about you in certain situations:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 marker:text-yellow-500">
                <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others.</li>
                <li><strong>Emergency Contacts:</strong> When you trigger Panic Mode, your location and basic details will be shared exclusively with your pre-selected emergency contacts.</li>
                <li><strong>Other Users:</strong> When you interact with other users of the app, those users may see your name, profile photo, and descriptions of your activity (e.g., pet videos).</li>
              </ul>
            </div>

            {/* Section 4 */}
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <Lock className="text-yellow-500" /> 4. Security of Your Information
              </h2>
              <p>
                We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
              </p>
            </div>

            <hr className="border-gray-100" />

            {/* Contact Info */}
            <div className="bg-yellow-50 p-8 rounded-3xl border border-yellow-100 text-center space-y-4">
              <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Questions about your privacy?</h3>
              <p className="text-gray-600">
                If you have questions or comments about this Privacy Policy, please contact us at:
              </p>
              <a href="mailto:privacy@mazitosocial.com" className="inline-block text-xl font-black text-yellow-600 hover:text-yellow-500 transition-colors">
                privacy@mazitosocial.com
              </a>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}