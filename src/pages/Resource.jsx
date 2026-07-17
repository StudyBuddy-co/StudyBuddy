import { PortalSidebar } from "../components/PortalSidebar";
import { useRecentActivity } from "../hooks/useRecentActivity";

const academicResources = [
  { label: "Best Courses To Take Depending on Major/Quarter/Career", href: "#" },
  { label: "Finding and Applying to Scholarships", href: "#" },
  { label: "Available Scholarships", href: "#" },
  { label: "Applying to Majors as a Pre-major", href: "#" },
  { label: "Applying to UW as a Cross Campus Student", href: "#" },
  { label: "Applying to UW as a Transfer", href: "#" },
  { label: "Securing Funding for Conferences", href: "#" },
  { label: "Best Resources on Campus", href: "#" },
  { label: "Important Deadlines!", href: "#" },
];

const careerResources = [
  { label: "Different Career Paths Depending on Majors", href: "#" },
  { label: "Best Practices and Examples for Creating a Good Resume", href: "#" },
  { label: "Finding and Applying to Internships", href: "#" },
  { label: "Available Internships", href: "#" },
  { label: "Alternative Internships (research, fellowships, etc.)", href: "#" },
  { label: "Career Clubs at UW", href: "#" },
];

const mentalHealthResources = [
  { label: "Best Practices for Mental Health", href: "#" },
  { label: "Best Practices for Stress Management", href: "#" },
  { label: "Best Practices for Time Management", href: "#" },
  { label: "Comprehensive List of Mental Health Resources (Hotlines, UW resources)", href: "#" },
];

function ResourceSection({ title, icon, items, accentColor }) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-stone-200 p-6 space-y-4">
      <h2 className={`text-xl font-bold ${accentColor} flex items-center gap-2`}>
        <span>{icon}</span> {title}
      </h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.label} className="flex items-start gap-2">
            <span className="text-teal-500 mt-1">•</span>
            <span className="text-gray-700">
              {item.label}:{" "}
              <a
                href={item.href}
                className="text-teal-600 font-medium hover:underline hover:text-cyan-600"
              >
                Click Me.
              </a>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ResourcesPage() {
  const recentActivity = useRecentActivity("Resources");

  return (
    <div className="flex bg-gradient-to-br from-stone-50 to-teal-50 min-h-screen">
      <PortalSidebar />

      <div className="flex-1 grid grid-cols-1 xl:grid-cols-4 gap-6 p-8">
        {/* Main content */}
        <div className="xl:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl shadow-md border border-stone-200 p-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-4">
              Welcome to StudyBuddy Resources! 📚
            </h1>
            <p className="text-gray-600 leading-relaxed">
              On this page you will find a wide array of resources to help you succeed in
              your academic and career goals. We have resources for academic success, career
              success, and mental health. We hope that you find these resources helpful and
              that they help you achieve your goals. If you have any questions, concerns
              and/or resources we should add, please feel free to reach out to us at the
              contact page. Thank you for visiting StudyBuddy Resources!
            </p>
          </div>

          <ResourceSection
            title="Academic Resources"
            icon="🎓"
            items={academicResources}
            accentColor="text-teal-700"
          />
          <ResourceSection
            title="Career Resources"
            icon="💼"
            items={careerResources}
            accentColor="text-cyan-700"
          />
          <ResourceSection
            title="Mental Health Resources"
            icon="💚"
            items={mentalHealthResources}
            accentColor="text-emerald-700"
          />
        </div>

        {/* Right panel */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-md border border-stone-200 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">📋 Recent Activity</h3>
            {recentActivity.length === 0 ? (
              <p className="text-sm text-gray-400">No recent activity yet.</p>
            ) : (
              <ul className="space-y-2">
                {recentActivity.map((item, i) => (
                  <li key={i} className="flex justify-between text-sm">
                    <span className="text-gray-700">{item.label}</span>
                    <span className="text-gray-400">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-stone-200 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">✨ Important Resources</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="/contact" className="text-teal-600 font-medium hover:underline">
                  Contact Us
                </a>
                <p className="text-gray-500">Questions or resource suggestions.</p>
              </li>
              <li>
                <a href="/findtutor" className="text-teal-600 font-medium hover:underline">
                  Find a Peer Tutor
                </a>
                <p className="text-gray-500">Get matched with complementary study partners.</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}