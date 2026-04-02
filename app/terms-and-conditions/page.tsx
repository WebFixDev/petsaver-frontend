import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FileText, AlertCircle, Scale, ShieldBan, Gavel, CheckCircle, ShieldAlert } from 'lucide-react';

export default function TermsAndConditions() {
  const lastUpdated = "April 2, 2026";

  return (
    <main className="min-h-screen bg-[#fefaf5] text-gray-900 selection:bg-yellow-200 font-sans">
      <Navbar />

      {/* --- HEADER SECTION --- */}
      <section className="bg-gray-900 pt-20 pb-32 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-5 rotate-12 -translate-y-10 pointer-events-none">
          <Scale size={400} className="text-white" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-800 text-gray-300 rounded-full text-sm font-bold uppercase tracking-wider shadow-sm mb-6 border border-gray-700">
            <FileText size={14} className="text-yellow-500" /> Legal Agreement
          </div>
          <h1 className="text-5xl lg:text-6xl font-black text-white mb-6">Terms & Conditions</h1>
          <p className="text-gray-400 text-xl font-medium max-w-2xl mx-auto">
            Please read these terms carefully. By using Mazito Social, you agree to these rules.
          </p>
          <p className="text-yellow-500 mt-6 font-medium">Last Updated: {lastUpdated}</p>
        </div>
      </section>

      {/* --- CONTENT SECTION --- */}
      <section className="max-w-4xl mx-auto px-6 -mt-20 relative z-20 pb-24">
        <div className="bg-white rounded-[3rem] shadow-xl shadow-gray-200/50 p-8 lg:p-14 border border-gray-100">
          
          <div className="space-y-12 text-lg text-gray-600 leading-relaxed">
            
            {/* Introduction */}
            <div>
              <p>
                Welcome to <strong>Mazito Social</strong>. These Terms and Conditions govern your use of our short-video platform, website, and related services. By creating an account (via email or Google) or using the app, you agree to be bound by these terms. 
              </p>
            </div>

            {/* Section 1 */}
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <CheckCircle className="text-yellow-500" /> 1. Acceptance of Terms & Accounts
              </h2>
              <p>
                By accessing Mazito Social, you confirm that you are at least 13 years old. You are responsible for maintaining the confidentiality of your account login information. You agree to choose an appropriate, unique username and are fully responsible for all activities (videos uploaded, chats sent) that occur under your account.
              </p>
            </div>

            {/* Section 2 */}
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <ShieldBan className="text-yellow-500" /> 2. Community & Content Guidelines
              </h2>
              <p>Mazito Social is a platform for creativity and connection. You are solely responsible for the content you upload, edit, or tag. You strictly agree <strong>NOT</strong> to post:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 marker:text-yellow-500">
                <li>Hate speech, bullying, harassment, or threats against other users in videos or private chats.</li>
                <li>Inappropriate, excessively violent, or sexually explicit content.</li>
                <li>Spam, deceptive content, or misleading information.</li>
                <li>Copyrighted music or videos that you do not have the rights or permission to use.</li>
              </ul>
              <div className="bg-red-50 p-4 rounded-2xl border border-red-100 text-red-700 text-sm flex gap-3 mt-4">
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <p><strong>Content Moderation:</strong> We reserve the right to review, restrict, or remove any video, tag, or music track that violates these guidelines. Persistent violations will result in account termination.</p>
              </div>
            </div>

            {/* Section 3 - Child Safety */}
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-red-700 flex items-center gap-3">
                <ShieldAlert className="text-red-600" /> 3. Child Safety Standards Policy
              </h2>
              <p>
                Mazito Social strictly adheres to a Zero-Tolerance policy regarding Child Sexual Abuse Material (CSAM) and the exploitation of minors.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 marker:text-red-600">
                <li>We do not tolerate any content that endangers or exploits children.</li>
                <li>Any user found sharing such material will be permanently banned and reported to relevant legal authorities, including NCMEC.</li>
                <li>If you encounter any such content, please use the in-app reporting tool immediately or contact our dedicated safety team at <strong>childsafety@mazito.io</strong>.</li>
              </ul>
            </div>

            {/* Section 4 */}
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <Gavel className="text-yellow-500" /> 4. Intellectual Property & Uploads
              </h2>
              <p>
                You retain ownership of the original videos and music you upload from your gallery to Mazito Social. However, by posting content, you grant us a worldwide, non-exclusive, royalty-free license to use, distribute, modify, and display that content to operate the platform. The Mazito Social app design, logo, and code remain our exclusive property.
              </p>
            </div>

            {/* Section 5 */}
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <Scale className="text-yellow-500" /> 5. Account Termination
              </h2>
              <p>
                We reserve the right to suspend or terminate your account (including your unique username and all uploaded data) at any time, without notice, for conduct that we believe violates these Terms, or is harmful to other users.
              </p>
            </div>

            <hr className="border-gray-100" />

            {/* Contact Info */}
            <div className="text-center space-y-4 pt-4">
              <h3 className="text-xl font-bold text-gray-900">Need legal clarification or support?</h3>
              <p className="text-gray-600">
                For general support or legal inquiries, contact us at:
              </p>
              <a href="mailto:support@mazito.io" className="inline-block font-bold text-yellow-600 hover:text-yellow-500 transition-colors">
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