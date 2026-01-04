import { ServiceCard } from "./ServiceCard";

export function ServicesSection() {
  const services = [
    {
      title: "Tutoring Sessions",
      description: "Select your peer tutors based on their strengths in the areas where you need help. You'll be paired with peers who excel in subjects where you need to step up. Other tutors are also willing to support you and have the experience for all your tutoring requests.",
      imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
      gradient: "from-teal-400 to-cyan-400",
    },
    {
      title: "Academic Career Resources",
      description: "At StudyBuddy, we provide a comprehensive range of career and academic resources designed to help you progress in your future endeavors and aspirations. Our staff offers valuable resources and practical advice, including internship opportunities.",
      imageUrl: "https://images.unsplash.com/photo-1553877522-43269d4ea984",
      gradient: "from-emerald-400 to-teal-400",
    },
    {
      title: "Connections",
      description: "Through StudyBuddy's you'll have the chance to meet students you've probably never crossed paths with before. These connections aren't just limited to the academics. You're not confined to meeting people just for studying. Connect with peers who share your interests and goals.",
      imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c",
      gradient: "from-sky-400 to-cyan-400",
    },
  ];

  return (
    <section className="
      py-20 px-6
      bg-gradient-to-b from-white to-teal-50
      dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-800
    ">
      <div className="max-w-7xl mx-auto">

<div className="text-center mb-16 space-y-4">
  <div className="inline-block">
    <h2 className="
      text-3xl lg:text-4xl font-bold
      bg-gradient-to-r from-teal-600 to-cyan-600
      dark:from-cyan-400 dark:to-sky-400
      bg-clip-text text-transparent
    ">
      Our Services ✨
    </h2>

    <div className="
      w-32 h-1 mx-auto mt-2 rounded-full
      bg-gradient-to-r from-teal-400 to-cyan-400
      dark:from-cyan-500 dark:to-sky-500
    " />
  </div>

  <p className="
    text-lg max-w-2xl mx-auto
    text-gray-600
    dark:text-white
  ">
    Discover how we can help you achieve your academic goals with our comprehensive range of services
  </p>
</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <ServiceCard key={i} {...service} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="
            inline-flex items-center gap-3 px-8 py-4 rounded-full
            bg-gradient-to-r from-teal-400 to-cyan-400
            dark:from-teal-500 dark:to-cyan-500
            text-white font-semibold shadow-lg
            hover:scale-105 transition
          ">
            Get Started Today 🚀
          </div>
        </div>

      </div>
    </section>
  );
}