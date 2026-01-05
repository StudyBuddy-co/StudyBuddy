export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-teal-50">

      {/* Hero */}
      <section className="py-20 px-6 text-center">
        <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
          Get in Touch 📬
        </h1>
        <div className="w-32 h-2 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full mx-auto mt-4" />
        <p className="mt-6 text-xl text-gray-700 max-w-3xl mx-auto">
          Have questions? Need support? Want to join our tutor network? We'd love to hear from you!
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* Contact Form */}
        <div className="bg-white border border-teal-100 rounded-xl shadow-xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Send us a Message ✉️</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="First Name"
              className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500"
            />
            <input
              placeholder="Last Name"
              className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500"
          />

          <input
            placeholder="Subject"
            className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500"
          />

          <textarea
            rows={6}
            placeholder="Your message..."
            className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500"
          />

          <button className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white py-2 rounded-md font-medium transition">
            Send Message 🚀
          </button>
        </div>

        {/* Contact Info */}
        <div className="space-y-8">

          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-4xl mb-4">📧</div>
            <h3 className="text-xl font-bold text-gray-800">Email Us</h3>
            <p className="text-teal-600 mt-2">hello@studybuddy.com</p>
            <p className="text-teal-600">support@studybuddy.com</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Live Chat</h3>
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md">
              Start Chat
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-4xl mb-4">🎓</div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Become a Tutor</h3>
            <button className="border border-amber-400 text-amber-600 px-4 py-2 rounded-md hover:bg-amber-50">
              Apply Now
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}