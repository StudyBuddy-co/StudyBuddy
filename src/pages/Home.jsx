import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { ServicesSection } from "../components/ServiceSection";
import { ImageWithFallback } from '../figma/ImageWithFallback';

export function Home() {
  return (
    <div>
<Header></Header>
    <section className="bg-gradient-to-br from-stone-50 via-teal-50 to-cyan-50 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex-1 space-y-6">
            <div className="inline-block">
              <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-sky-600 bg-clip-text text-transparent leading-tight">
                Welcome to StudyBuddy! ✨
              </h2>
              <div className="w-full h-2 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full mt-2 opacity-60"></div>
            </div>

            <p className="text-lg text-gray-700 leading-relaxed max-w-2xl">
              Your one-stop shop for all your study needs! 📚 We offer a wide range of services to help you succeed in your studies. Whether you need help with a particular subject or you need help with your study skills, we have you covered. Our team of experts are here to help you every step of the way. So why wait? Get started today! 🚀
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center space-x-2 bg-white/80 rounded-full px-4 py-2 shadow-md border border-teal-100">
                <span className="text-2xl">🎯</span>
                <span className="text-sm font-medium text-gray-700">Expert Tutors</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/80 rounded-full px-4 py-2 shadow-md border border-teal-100">
                <span className="text-2xl">⭐</span>
                <span className="text-sm font-medium text-gray-700">Personalized Learning</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/80 rounded-full px-4 py-2 shadow-md border border-teal-100">
                <span className="text-2xl">🤝</span>
                <span className="text-sm font-medium text-gray-700">Study Communities</span>
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-lg">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-3xl opacity-20 animate-pulse"></div>
              <div className="relative bg-white rounded-2xl p-6 shadow-xl border border-teal-100">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="A photo of Students studying and laughing together"
                  className="w-full h-64 object-cover rounded-xl"
                />
                {/*<div className="absolute top-2 right-2 bg-amber-400 text-teal-800 rounded-full w-12 h-12 flex items-center justify-center text-xl">
                  🎉
                </div>*/}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
<ServicesSection></ServicesSection>
<Footer></Footer>
    </div>
  );
}