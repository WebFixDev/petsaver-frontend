import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FileText, AlertCircle, Scale, ShieldBan, Gavel, CheckCircle } from 'lucide-react';

export default function TermsAndConditions() {
  const lastUpdated = "March 31, 2026";

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
            Please read these terms carefully before using Mazito Social. By using our platform, you agree to these rules.
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
                Welcome to <strong>Mazito Social</strong>. These Terms and Conditions govern your use of our mobile application, website, and related services. By creating an account or using the app, you agree to be bound by these terms. 
              </p>
            </div>

            {/* Section 1 */}
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <CheckCircle className="text-yellow-500" /> 1. Acceptance of Terms
              </h2>
              <p>
                By accessing Mazito Social, you confirm that you are at least 13 years old (or the legal age of digital consent in your country). If you are opening an account on behalf of a pet brand or organization, you represent that you have the authority to bind that entity to these terms.
              </p>
            </div>

            {/* Section 2 */}
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <ShieldBan className="text-yellow-500" /> 2. Community & Content Guidelines
              </h2>
              <p>Mazito Social is a safe space for pet lovers. You are solely responsible for the content (videos, comments, photos) you post. You strictly agree <strong>NOT</strong> to post:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 marker:text-yellow-500">
                <li>Content that depicts animal abuse, neglect, or cruelty in any form.</li>
                <li>Hate speech, bullying, or harassment against other pet parents.</li>
                <li>Misleading veterinary advice. Always consult a certified vet for medical issues.</li>
                <li>Inappropriate, violent, or sexually explicit content.</li>
              </ul>
              <div className="bg-red-50 p-4 rounded-2xl border border-red-100 text-red-700 text-sm flex gap-3 mt-4">
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <p><strong>Zero Tolerance Policy:</strong> Any violation of the animal cruelty guideline will result in an immediate permanent ban and potential reporting to local animal welfare authorities.</p>
              </div>
            </div>

            {/* Section 3 */}
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <AlertCircle className="text-yellow-500" /> 3. Fair Use of Panic Mode
              </h2>
              <p>
                The <strong>Panic Mode</strong> feature is designed for emergency situations regarding your pet's safety or your safety during pet meetups. You agree to use this feature responsibly. Intentional misuse, spamming, or false triggering of the Panic Mode may result in the temporary suspension of your account.
              </p>
            </div>

            {/* Section 4 */}
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <Gavel className="text-yellow-500" /> 4. Intellectual Property
              </h2>
              <p>
                You retain ownership of the content you upload to Mazito Social. However, by posting content, you grant us a worldwide, non-exclusive, royalty-free license to use, distribute, modify, and display that content to operate and promote the platform. The Mazito Social logo, design, and code are our exclusive property.
              </p>
            </div>

            {/* Section 5 */}
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <Scale className="text-yellow-500" /> 5. Account Termination
              </h2>
              <p>
                We reserve the right to suspend or terminate your account at any time, without notice, for conduct that we believe violates these Terms and Conditions or is harmful to other users, us, or third parties, or for any other reason.
              </p>
            </div>

            <hr className="border-gray-100" />

            {/* Contact Info */}
            <div className="text-center space-y-4 pt-4">
              <h3 className="text-xl font-bold text-gray-900">Need legal clarification?</h3>
              <p className="text-gray-600">
                Contact our legal team for any questions regarding these terms.
              </p>
              <a href="mailto:legal@mazitosocial.com" className="inline-block font-bold text-yellow-600 hover:text-yellow-500 transition-colors">
                legal@mazitosocial.com
              </a>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}