import { Link } from "react-router-dom";
import {
  Search,
  BookOpen,
  Star,
  Users,
  ArrowRight,
  CheckCircle,
  Zap,
  Shield,
  MessageSquare,
  Calendar,
  CreditCard,
  Award,
  TrendingUp,
  Sparkles,
  Play,
  GraduationCap,
} from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../context/AuthContext";
import heroBg from "../assets/hero-bg.jpg";
import ctaBg from "../assets/cta-bg.jpg";
import mentorBg from "../assets/mentor-bg.jpg";

const Home = () => {
  const { user } = useAuth();

  return (
    <MainLayout fullWidth>
      <section className="relative min-h-[calc(100vh-70px)] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroBg}
            alt="Students studying"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-surface-900/95 via-surface-900/80 to-primary-900/70" />
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl animate-float" />
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "2s" }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium px-4 py-2 rounded-full mb-6">
              <Sparkles size={13} className="text-primary-300" />
              <span>Trusted by 2,000+ students</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
              Learn faster with a{" "}
              <span className="text-primary-300 relative inline-block">
                peer tutor
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 8"
                  fill="none"
                >
                  <path
                    d="M2 5.5C50 2 100 2 198 5.5"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="text-primary-400"
                  />
                </svg>
              </span>{" "}
              who gets it
            </h1>

            <p className="text-surface-200 text-base md:text-lg mb-8 leading-relaxed max-w-lg">
              Connect with verified student tutors from your school. Book
              sessions, get real academic help, and boost your grades on your
              schedule.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-10">
              {user ? (
                <Link
                  to={
                    user.role === "student"
                      ? "/student/dashboard"
                      : "/tutor/dashboard"
                  }
                  className="flex items-center justify-center gap-2 bg-white text-primary-700 px-6 py-3.5 rounded-xl font-semibold hover:bg-primary-50 transition-all duration-200 shadow-lg shadow-primary-900/40 w-full sm:w-auto"
                >
                  Go to Dashboard
                  <ArrowRight size={17} />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="flex items-center justify-center gap-2 bg-primary-500 text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-primary-600 transition-all duration-200 shadow-lg shadow-primary-900/50 w-full sm:w-auto"
                  >
                    Get Started Free
                    <ArrowRight size={17} />
                  </Link>
                  <Link
                    to="/tutors"
                    className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-white/20 transition-all duration-200 w-full sm:w-auto"
                  >
                    <Play size={15} />
                    Watch Demo
                  </Link>
                </>
              )}
            </div>

            <div className="flex items-center gap-6 pt-6 border-t border-white/10">
              <div>
                <p className="text-white text-2xl font-bold">500+</p>
                <p className="text-surface-300 text-xs">Verified Tutors</p>
              </div>
              <div className="h-10 w-px bg-white/10" />
              <div>
                <p className="text-white text-2xl font-bold">2K+</p>
                <p className="text-surface-300 text-xs">Sessions Done</p>
              </div>
              <div className="h-10 w-px bg-white/10" />
              <div>
                <p className="text-white text-2xl font-bold">4.8</p>
                <p className="text-surface-300 text-xs">Star Rating</p>
              </div>
            </div>
          </div>

          <div className="hidden md:block relative animate-fade-in-up">
            <div className="relative">
              <div className="absolute top-4 -left-4 z-20 bg-white rounded-2xl shadow-2xl p-4 max-w-[220px] animate-float">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-700 text-xs font-bold">AI</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-surface-800">
                      Amina Ibrahim
                    </p>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} size={9} className="text-warning fill-warning" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-surface-500">
                  Data Structures Expert
                </p>
              </div>

              <div
                className="absolute -bottom-4 -right-4 z-20 bg-white rounded-2xl shadow-2xl p-4 max-w-[240px] animate-float"
                style={{ animationDelay: "1.5s" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-9 h-9 rounded-full bg-success/20 flex items-center justify-center">
                    <CheckCircle size={17} className="text-success" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-surface-800">
                      Session Booked
                    </p>
                    <p className="text-xs text-surface-500">Monday, 10:00 AM</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto bg-white/10 rounded-full flex items-center justify-center mb-4 animate-pulse-slow">
                    <GraduationCap size={48} className="text-white" />
                  </div>
                  <p className="text-white/70 text-sm">
                    Join thousands of students learning smarter
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto animate-fade-in-up">
          <div className="text-center mb-14">
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-wider mb-3">
              Why TutorPair
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-surface-900 mb-4">
              Everything you need to <span className="text-primary-600">succeed</span>
            </h2>
            <p className="text-surface-500 text-base max-w-xl mx-auto">
              We built the platform we wished existed when we were struggling
              with our own coursework.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Search,
                title: "Smart Tutor Search",
                desc: "Filter tutors by subject, department, rating, and availability to find your perfect match in seconds.",
              },
              {
                icon: Calendar,
                title: "Easy Scheduling",
                desc: "Book sessions that fit your timetable. Choose between online or physical sessions on campus.",
              },
              {
                icon: CreditCard,
                title: "Secure Payments",
                desc: "Pay safely through Paystack. Your money is only released after you attend the session.",
              },
              {
                icon: MessageSquare,
                title: "In-app Messaging",
                desc: "Chat with your tutor before and after your session without ever leaving the platform.",
              },
              {
                icon: Shield,
                title: "Verified Tutors",
                desc: "Every tutor is a verified student with proven academic performance in their subject.",
              },
              {
                icon: Star,
                title: "Ratings and Reviews",
                desc: "Read honest reviews from other students and rate your own experience after each session.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group bg-white rounded-2xl p-6 border border-surface-100 hover:border-primary-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary-50 group-hover:bg-primary-100 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300">
                  <feature.icon size={22} className="text-primary-600" />
                </div>
                <h3 className="font-semibold text-surface-800 mb-2 text-base">
                  {feature.title}
                </h3>
                <p className="text-surface-500 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={mentorBg}
            alt="Mentor teaching"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-up">
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-wider mb-3">
              Simple Process
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-surface-900 mb-6">
              Get started in <br />
              <span className="text-primary-600">four easy steps</span>
            </h2>
            <p className="text-surface-500 mb-10">
              From sign up to your first session in less than 10 minutes.
            </p>

            <div className="space-y-6">
              {[
                {
                  num: "01",
                  title: "Create your account",
                  desc: "Sign up as a student or tutor in under two minutes.",
                },
                {
                  num: "02",
                  title: "Find the right tutor",
                  desc: "Search by subject, filter by availability and rating.",
                },
                {
                  num: "03",
                  title: "Book and pay securely",
                  desc: "Request a session and pay safely with Paystack.",
                },
                {
                  num: "04",
                  title: "Learn and grow",
                  desc: "Attend your session, rate your experience, book again.",
                },
              ].map((step, i) => (
                <div
                  key={step.num}
                  className="flex gap-4 animate-fade-in-up"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-100 text-primary-700 rounded-xl flex items-center justify-center font-bold text-sm">
                    {step.num}
                  </div>
                  <div>
                    <h4 className="font-semibold text-surface-800 mb-1">
                      {step.title}
                    </h4>
                    <p className="text-surface-500 text-sm leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden md:block animate-fade-in-up">
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-surface-100">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-surface-100">
                <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center">
                  <Award size={26} className="text-primary-600" />
                </div>
                <div>
                  <p className="font-bold text-surface-800">Session Confirmed</p>
                  <p className="text-xs text-surface-500">
                    Ready to start learning
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { label: "Tutor", value: "Amina Ibrahim" },
                  { label: "Subject", value: "Data Structures" },
                  { label: "Date", value: "Monday, Oct 12" },
                  { label: "Time", value: "10:00 AM - 11:30 AM" },
                  { label: "Mode", value: "Physical - Library B" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-surface-500">{item.label}</span>
                    <span className="font-medium text-surface-800">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-surface-100 flex items-center justify-between">
                <span className="text-surface-500 text-sm">Amount Paid</span>
                <span className="font-bold text-lg text-primary-600">
                  ₦2,500
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-surface-50">
        <div className="max-w-7xl mx-auto animate-fade-in-up">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Users, num: "500+", label: "Active Tutors" },
              { icon: BookOpen, num: "2,000+", label: "Sessions Done" },
              { icon: Star, num: "4.8/5", label: "Average Rating" },
              { icon: TrendingUp, num: "98%", label: "Success Rate" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-gradient-to-br from-white to-primary-50 rounded-2xl p-6 text-center border border-primary-100 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-12 h-12 mx-auto bg-primary-600 rounded-xl flex items-center justify-center mb-3">
                  <stat.icon size={22} className="text-white" />
                </div>
                <p className="text-3xl font-bold text-surface-900 mb-1">
                  {stat.num}
                </p>
                <p className="text-surface-500 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto animate-fade-in-up">
          <div className="text-center mb-12">
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-wider mb-3">
              Testimonials
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-surface-900 mb-4">
              What students are saying
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                name: "Chidi Okonkwo",
                role: "ND2 Computer Science",
                text: "I went from failing Data Structures to scoring an A. My tutor explained everything so clearly. This platform is a game changer.",
                rating: 5,
              },
              {
                name: "Fatima Yusuf",
                role: "HND1 Accounting",
                text: "Booking sessions is so easy. I love that I can chat with my tutor before we meet. It makes the sessions more productive.",
                rating: 5,
              },
              {
                name: "Emeka Obi",
                role: "ND1 Electrical Engineering",
                text: "Affordable prices and quality tutors from my own school. What more could I ask for? Highly recommended.",
                rating: 5,
              },
            ].map((review) => (
              <div
                key={review.name}
                className="bg-surface-50 rounded-2xl p-6 border border-surface-100 hover:shadow-lg hover:bg-white transition-all duration-300"
              >
                <div className="flex items-center gap-0.5 mb-4">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star
                      key={i}
                      size={15}
                      className="text-warning fill-warning"
                    />
                  ))}
                </div>
                <p className="text-surface-700 text-sm leading-relaxed mb-6">
                  "{review.text}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-surface-100">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-700 text-sm font-bold">
                      {review.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-surface-800">
                      {review.name}
                    </p>
                    <p className="text-xs text-surface-500">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={ctaBg}
            alt="Students learning"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/95 via-primary-800/95 to-primary-700/90" />
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse-slow" />
          <div
            className="absolute bottom-10 right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse-slow"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium px-4 py-2 rounded-full mb-6 animate-fade-in">
            <Zap size={13} />
            <span>Limited time - Free to sign up</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-5 leading-tight animate-fade-in-up">
            Your best semester
            <br />
            <span className="text-primary-200">starts today</span>
          </h2>

          <p className="text-primary-100 text-base md:text-lg mb-10 max-w-xl mx-auto animate-fade-in-up">
            Join thousands of students already using TutorPair to unlock
            their academic potential.
          </p>

          {!user && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up">
              <Link
                to="/register"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-primary-700 px-6 py-3.5 rounded-xl font-semibold hover:bg-primary-50 transition-all duration-200 shadow-xl"
              >
                Register as Student
                <ArrowRight size={17} />
              </Link>
              <Link
                to="/register"
                className="w-full sm:w-auto flex items-center justify-center gap-2 border-2 border-white/30 text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-all duration-200"
              >
                Become a Tutor
              </Link>
            </div>
          )}
        </div>
      </section>

      <footer className="bg-surface-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-1">
              <Link to="/" className="flex items-center gap-2.5 mb-4">
                <div className="bg-primary-600 text-white p-1.5 rounded-lg">
                  <GraduationCap size={20} />
                </div>
                <span className="font-bold text-lg text-white tracking-tight">
                  Tutor<span className="text-primary-400">Pair</span>
                </span>
              </Link>
              <p className="text-surface-400 text-sm leading-relaxed mb-5">
                The smart way to find peer tutors from your school and boost your grades.
              </p>
              <div className="flex items-center gap-2">
                
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white text-sm mb-4">Product</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link to="/tutors" className="text-surface-400 hover:text-primary-400 transition-colors">
                    Find Tutors
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-surface-400 hover:text-primary-400 transition-colors">
                    Become a Tutor
                  </Link>
                </li>
                <li>
                  <Link to="/how-it-works" className="text-surface-400 hover:text-primary-400 transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-surface-400 hover:text-primary-400 transition-colors">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white text-sm mb-4">Company</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link to="/about" className="text-surface-400 hover:text-primary-400 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="text-surface-400 hover:text-primary-400 transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-surface-400 hover:text-primary-400 transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="text-surface-400 hover:text-primary-400 transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white text-sm mb-4">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link to="/terms" className="text-surface-400 hover:text-primary-400 transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-surface-400 hover:text-primary-400 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/cookies" className="text-surface-400 hover:text-primary-400 transition-colors">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link to="/help" className="text-surface-400 hover:text-primary-400 transition-colors">
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-surface-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-surface-400 text-sm text-center md:text-left">
              © 2026 TutorPair. All rights reserved by{" "}
              <span className="text-primary-400 font-semibold">Oracle</span>.
            </p>
            <p className="text-surface-500 text-xs">
              Built with care for students, by students.
            </p>
          </div>
        </div>
      </footer>
    </MainLayout>
  );
};

export default Home;