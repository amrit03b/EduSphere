import Link from "next/link"
import { Brain, Users, Video, BookOpen, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-blossom-50 to-pink-50">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blossom-500 to-rose-500 rounded-lg flex items-center justify-center logo-animation pink-glow">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold brand-text-animation">
                <span className="pink-gradient-text">Edu</span><span className="text-gray-800">Sphere</span>
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="bg-gradient-to-r from-blossom-500 to-rose-500 text-white px-6 py-3 rounded-xl hover:from-blossom-600 hover:to-rose-600 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 shadow-lg hover:shadow-xl font-semibold text-base"
              >
                <svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_17_40)">
                    <path d="M47.5 24.5C47.5 22.6 47.3 20.8 47 19H24V29.1H37.4C36.7 32.2 34.7 34.7 31.8 36.4V42.1H39.5C44 38.1 47.5 32.1 47.5 24.5Z" fill="#4285F4"/>
                    <path d="M24 48C30.6 48 36.1 45.9 39.5 42.1L31.8 36.4C29.9 37.6 27.3 38.4 24 38.4C17.7 38.4 12.2 34.3 10.3 28.7H2.3V34.6C5.7 41.1 14.1 48 24 48Z" fill="#34A853"/>
                    <path d="M10.3 28.7C9.7 26.6 9.7 24.4 10.3 22.3V16.4H2.3C-0.2 21.1-0.2 26.9 2.3 34.6L10.3 28.7Z" fill="#FBBC05"/>
                    <path d="M24 9.6C27.6 9.6 30.6 10.8 32.7 12.7L39.7 5.7C36.1 2.4 30.6 0 24 0C14.1 0 5.7 6.9 2.3 16.4L10.3 22.3C12.2 16.7 17.7 12.6 24 12.6V9.6Z" fill="#EA4335"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_17_40">
                      <rect width="48" height="48" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
                <span>Login with Google</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-6 hero-title">
            <span className="pink-gradient-text">Edu</span><span className="text-gray-800">Sphere</span>: Learn Deeper, Learn Smarter
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto hero-subtitle">
            Transforming syllabuses into interactive, AI-powered knowledge — <span className="text-blossom-600 font-bold text-2xl">TOGETHER</span> ✨
          </p>
          <Link
            href="/login"
            className="inline-flex items-center bg-gradient-to-r from-blossom-500 to-rose-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blossom-600 hover:to-rose-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hero-button"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5 animate-bounce" />
          </Link>
        </div>

        {/* Hero Illustration */}
        <div className="mt-16 flex justify-center">
          <div className="relative hero-illustration">
            <div className="w-64 h-64 bg-gradient-to-br from-blossom-100 to-rose-100 rounded-full flex items-center justify-center animate-float">
              <div className="relative">
                <Brain className="h-24 w-24 text-blossom-600 animate-pulse-pink" />
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-rose-400 to-blossom-400 rounded-full flex items-center justify-center animate-glow">
                  <Users className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="card hover:scale-105 transition-all duration-300 animate-slide-in-left">
            <div className="w-12 h-12 bg-gradient-to-r from-blossom-100 to-rose-100 rounded-xl flex items-center justify-center mb-4">
              <Brain className="h-6 w-6 text-blossom-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">AI-Powered Knowledge Trees</h3>
            <p className="text-gray-600">Transform your syllabus into interactive, visual knowledge structures.</p>
          </div>

          <div className="card hover:scale-105 transition-all duration-300 animate-slide-up" style={{animationDelay: '0.1s'}}>
            <div className="w-12 h-12 bg-gradient-to-r from-rose-100 to-pink-100 rounded-xl flex items-center justify-center mb-4">
              <Video className="h-6 w-6 text-rose-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Intelligent Video Summaries</h3>
            <p className="text-gray-600">Get AI-generated summaries and key insights from educational videos.</p>
          </div>

          <div className="card hover:scale-105 transition-all duration-300 animate-slide-up" style={{animationDelay: '0.2s'}}>
            <div className="w-12 h-12 bg-gradient-to-r from-pink-100 to-fuchsia-100 rounded-xl flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-pink-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Collaborative Study Spaces</h3>
            <p className="text-gray-600">Study together with peers in shared, interactive learning environments.</p>
          </div>

          <div className="card hover:scale-105 transition-all duration-300 animate-slide-in-right" style={{animationDelay: '0.3s'}}>
            <div className="w-12 h-12 bg-gradient-to-r from-fuchsia-100 to-purple-100 rounded-xl flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-fuchsia-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Personalized Study Tools</h3>
            <p className="text-gray-600">Adaptive flashcards, quizzes, and study plans tailored to your progress.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
