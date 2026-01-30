export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-400 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-white dark:text-gray-200 py-12 px-6">
      <div className="max-w-7xl mx-auto text-center space-y-4">
        <div className="flex justify-center items-center space-x-2">
          <span className="text-2xl">🎓</span>
          <h3 className="text-xl font-bold">StudyBuddy</h3>
          <span className="text-2xl">✨</span>
        </div>

        <p className="text-white-100">
          Empowering students to achieve their dreams, one study session at a time
        </p>

        <div className="flex justify-center space-x-6 pt-4">
          <a href="#" className="hover:text-yellow-300 transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-yellow-300 transition-colors">
            Terms of Service
          </a>
          <button
            /* onClick={() => setCurrentPage('contact')} */
            className="hover:text-yellow-300 transition-colors"
          >
            Contact Us
          </button>
        </div>

        <p>&copy; {new Date().getFullYear()} StudyBuddy. All rights reserved.</p>
      </div>
    </footer>
  );
}