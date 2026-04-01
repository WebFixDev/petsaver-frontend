export default function Footer() {
  return (
    <footer className="max-w-7xl mx-auto px-6 py-10 mt-12 border-t border-yellow-100 text-gray-500">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-center md:text-left">
          © 2026 Mazito Social — A pets community for all. 
          <span className="text-yellow-500 ml-1">💛</span>
        </p>
        
        <div className="flex gap-8 font-medium">
          <a href="terms-and-conditions" className="hover:text-yellow-600 transition-colors">Terms & Conditions</a>
          <a href="privacy-policy" className="hover:text-yellow-600 transition-colors">Privacy Policy</a>
          <span className="hover:text-yellow-600 transition-colors">Copyright 2026</span>
        </div>
      </div>
    </footer>
  );
}