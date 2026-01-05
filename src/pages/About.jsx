import { ImageWithFallback } from '../figma/ImageWithFallback';
import FounderHeadshot from '../figma/Mumtaz-Sheikhaden-Professional-Headshot.jpg';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-teal-50">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-block">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              About StudyBuddy 🎓
            </h1>
            <div className="w-48 h-2 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full mx-auto mt-4"></div>
          </div>

          <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
            We're passionate about making learning accessible, engaging, and effective for every student. Our platform connects learners with expert tutors and provides the tools needed for academic success.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-800">Our Mission 🚀</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                To create a supportive learning environment where students can connect with peer tutors, access valuable resources, and build lasting academic relationships. We believe that every student deserves personalized support to reach their full potential.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-teal-100 rounded-full p-2 mt-1">
                    <span className="text-teal-600">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Peer-to-Peer Learning</h4>
                    <p className="text-gray-600">Connect with fellow students who excel in your challenging subjects</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-cyan-100 rounded-full p-2 mt-1">
                    <span className="text-cyan-600">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Career Resources</h4>
                    <p className="text-gray-600">Access internships, job opportunities, and career guidance</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-emerald-100 rounded-full p-2 mt-1">
                    <span className="text-emerald-600">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Community Building</h4>
                    <p className="text-gray-600">Build connections that extend beyond academics</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-3xl opacity-20"></div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Students collaborating"
                className="relative w-full h-80 object-cover rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-teal-50 to-cyan-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-4">
              Our Values 💫
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These core principles guide everything we do at StudyBuddy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-teal-100 text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Collaboration</h3>
              <p className="text-gray-600">We believe the best learning happens when students work together and support each other's growth.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-cyan-100 text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Excellence</h3>
              <p className="text-gray-600">We're committed to providing high-quality tutoring and resources that truly make a difference.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-emerald-100 text-center">
              <div className="text-4xl mb-4">🌟</div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Empowerment</h3>
              <p className="text-gray-600">We empower students to take control of their learning journey and achieve their academic goals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Meet Our Team 👥</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our dedicated team is here to support your academic journey every step of the way
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Mumtaz Sheikhaden",
                role: "Founder & CEO",
                image: FounderHeadshot,
                bio: "Current Student passionate about peer to peer learning",
                sources: "Check me out!",
                socials: { linkedin: "https://www.linkedin.com/in/mumtaz-sheikhaden/"}
              } /*,
              {
                name: "David Chen",
                role: "Head of Technology",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                bio: "Building the future of educational technology"
              } ,
              {
                name: "Maria Rodriguez",
                role: "Community Manager",
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                bio: "Connecting students and fostering learning communities"
              }*/
            ].map((member, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6 mx-auto w-32 h-32">
                  <div className="absolute -inset-2 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <ImageWithFallback
                    src={member.image}
                    alt={member.name}
                    className="relative w-32 h-32 object-cover rounded-full mx-auto shadow-lg"
                  />
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h4>
                <p className="text-teal-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
                <p className="text-gray-600 text-sm">{member.sources}</p>
<p className="text-gray-600 text-sm hover:bg-blue-100 hover:underline">
  <a
    href={member.socials.linkedin}
    target="_blank"
    rel="noopener noreferrer"
  >
    LinkedIn
  </a>
</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}