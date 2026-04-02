import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShieldCheck, Eye, Database, Lock, UserCheck, Mail, ShieldAlert } from 'lucide-react';

export default function PrivacyPolicy() {
  const lastUpdated = "April 2, 2026";

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
            At Mazito Social, we care about your privacy. Here is how we protect your data while you create, share, and connect.
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
                Welcome to <strong>Mazito Social</strong>. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application.
              </p>
            </div>

            {/* Section 1 */}
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <Database className="text-yellow-500" /> 1. Information We Collect
              </h2>
              <p>We collect information to provide better services to all our users:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 marker:text-yellow-500">
                <li><strong>Account Information:</strong> When you register using Email/Password or Google Sign-In, we collect your email, basic profile details, and assign you a unique username.</li>
                <li><strong>User-Generated Content:</strong> Videos you record or upload from your gallery, custom music tracks you upload, text overlays, tags, and comments.</li>
                <li><strong>Communications:</strong> Private messages and chats between you and your friends on the platform.</li>
                <li><strong>Device & Usage Data:</strong> IP address, device type, operating system, and how you interact with content (likes, follows, views).</li>
              </ul>
            </div>

            {/* Section 2 */}
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <Eye className="text-yellow-500" /> 2. How We Use Your Information
              </h2>
              <p>We use the information collected about you to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 marker:text-yellow-500">
                <li>Create, manage, and authenticate your account.</li>
                <li>Host and display your videos based on the privacy settings you select (e.g., Public, Friends Only, Private).</li>
                <li>Enable social features like following/unfollowing users, viewing profiles, and real-time chatting.</li>
                <li>Personalize your video feed to show you trending and relevant content.</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <UserCheck className="text-yellow-500" /> 3. Sharing of Your Information
              </h2>
              <p>We do <strong>not</strong> sell your personal data. We may share information in the following situations:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 marker:text-yellow-500">
                <li><strong>With Other Users:</strong> Based on your selected post privacy settings, other users will see your unique username, profile picture, and the videos/content you choose to share.</li>
                <li><strong>By Law:</strong> If we believe the release of information is necessary to respond to legal process, investigate potential violations, or protect the safety of others.</li>
              </ul>
            </div>

            {/* Section 4 */}
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <Lock className="text-yellow-500" /> 4. Security of Your Information
              </h2>
              <p>
                We use administrative, technical, and physical security measures to help protect your personal information and private chats. While we take reasonable steps to secure your data, please be aware that no security measures are perfectly impenetrable.
              </p>
            </div>

            {/* Section 5 - Child Safety */}
            <div className="space-y-4 bg-red-50 p-6 rounded-2xl border border-red-100">
              <h2 className="text-2xl font-black text-red-700 flex items-center gap-3">
                <ShieldAlert className="text-red-600" /> 5. Child Safety Standards & CSAM Policy
              </h2>
              <p className="text-red-900">
                Mazito Social has a strict <strong>ZERO-TOLERANCE</strong> policy against Child Sexual Abuse Material (CSAM) and the exploitation of minors.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-red-800 marker:text-red-600 font-medium">
                <li>We actively monitor and remove any content that violates child safety laws.</li>
                <li>Any user uploading, sharing, or promoting child exploitation material will be immediately and permanently banned.</li>
                <li>We will report offenders and provide their data to the relevant national and international authorities (including NCMEC).</li>
                <li>Users can report inappropriate content directly through our in-app reporting tool or by emailing <strong>childsafety@mazito.io</strong>.</li>
              </ul>
            </div>

            <hr className="border-gray-100" />

            {/* Contact Info */}
            <div className="bg-yellow-50 p-8 rounded-3xl border border-yellow-100 text-center space-y-4">
              <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Questions about your privacy?</h3>
              <p className="text-gray-600">
                If you have questions about this Privacy Policy, please contact us at:
              </p>
              <a href="mailto:support@mazito.io" className="inline-block text-xl font-black text-yellow-600 hover:text-yellow-500 transition-colors">
                support@mazito.io
              </a>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}