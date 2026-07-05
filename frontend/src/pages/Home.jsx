import { Link } from "react-router-dom";
import { Search, BookOpen, Star, Users } from "lucide-react";
import MainLayout from "../layouts/MainLayout";

const Home = () => {
  return (
    <MainLayout>
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Find Your Perfect Tutor
        </h1>
        <p className="text-gray-500 text-lg mb-8 max-w-xl mx-auto">
          Connect with peer tutors who excel in the subjects you need help with.
          Book sessions, learn better, achieve more.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/register"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
          >
            Get Started
          </Link>
          <Link
            to="/tutors"
            className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50"
          >
            Browse Tutors
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
          <div className="flex justify-center mb-3 text-blue-600">
            <Search size={32} />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Search Tutors</h3>
          <p className="text-gray-500 text-sm">
            Find tutors by subject, department, or rating.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
          <div className="flex justify-center mb-3 text-blue-600">
            <BookOpen size={32} />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Book a Session</h3>
          <p className="text-gray-500 text-sm">
            Schedule a session that fits your timetable.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
          <div className="flex justify-center mb-3 text-blue-600">
            <Star size={32} />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Rate and Review</h3>
          <p className="text-gray-500 text-sm">
            Share your experience and help others choose.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;