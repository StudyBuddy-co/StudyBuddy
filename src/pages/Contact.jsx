import { useState, useEffect } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../services/Firebase";
import { useAuth } from "../auth/useAuth";

export default function ContactPage() {
  const { user } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      if (!firstName || !lastName || !email || !message) {
        throw new Error("Please fill in all required fields.");
      }

      await addDoc(collection(db, "contactMessages"), {
        name: `${firstName} ${lastName}`,
        email,
        subject: subject || "General Inquiry",
        message,
        status: "new",
        userId: user?.uid || null,
        createdAt: serverTimestamp(),
      });

      setSuccess(true);
      setFirstName("");
      setLastName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
      }, 6000); // 6 seconds

      return () => clearTimeout(timer);
    }
  }, [success]);

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
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-teal-100 rounded-xl shadow-xl p-8 space-y-6"
        >
          <h2 className="text-2xl font-bold text-gray-800">Send us a Message ✉️</h2>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 p-2 rounded">
              {error}
            </p>
          )}

          {success && (
            <p className="text-green-600 text-sm bg-green-50 p-2 rounded">
              Message sent successfully! We’ll get back to you soon.
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500"
            />
            <input
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500"
          />

          <input
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500"
          />

          <textarea
            rows={6}
            placeholder="Your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 h-[90px]"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white py-2 rounded-md font-medium transition disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Message 🚀"}
          </button>
        </form>

        {/* Contact Info */}
        <div className="space-y-8">

          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-4xl mb-4">📧</div>
            <h3 className="text-xl font-bold text-gray-800">Email Us</h3>
            <p className="text-teal-600 mt-2">hello@studybuddy.com</p>
            <p className="text-teal-600">support@studybuddy.com</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center relative opacity-60 cursor-not-allowed">
            {/* Coming Soon Badge */}
              <span className="absolute top-4 right-4 text-xs font-semibold uppercase tracking-wide bg-gray-200 text-gray-600 px-3 py-1 rounded-full">
                Coming Soon
              </span>

              {/* Icon */}
              <div className="text-4xl mb-4">💬</div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Live Chat
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-6">
                Chat live with our support team for instant help and guidance.
              </p>

              {/* Disabled Button */}
              <button
                disabled
                className="bg-gray-300 text-gray-600 px-4 py-2 rounded-md cursor-not-allowed"
              >
                Start Chat
              </button>
          </div>

          {/*<div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-4xl mb-4">🎓</div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Become a Tutor</h3>
            <button className="border border-amber-400 text-amber-600 px-4 py-2 rounded-md hover:bg-amber-50">
              Apply Now
            </button>
          </div>\*/}

        </div>
      </div>
    </div>
  );
}