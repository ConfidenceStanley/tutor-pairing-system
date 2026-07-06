import { BookOpen, Clock, CheckCircle, Search, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../context/AuthContext";

const StatCard = ({ icon: Icon, value, label, color }) => (
  <div className="bg-white rounded-2xl p-5 border border-surface-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow duration-200">
    <div className={`${color} p-3 rounded-xl`}>
      <Icon size={20} className="text-white" />
    </div>
    <div>
      <p className="text-2xl font-bold text-surface-800">{value}</p>
      <p className="text-sm text-surface-500">{label}</p>
    </div>
  </div>
);

const StudentDashboard = () => {
  const { user } = useAuth();

  return (
    <MainLayout>
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-2xl font-bold text-surface-900">
          Welcome back, {user?.name?.split(" ")[0]}
        </h1>
        <p className="text-surface-500 text-sm mt-1">
          Here is your learning overview
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-fade-in-up">
        <StatCard
          icon={Clock}
          value="0"
          label="Pending Requests"
          color="bg-warning"
        />
        <StatCard
          icon={BookOpen}
          value="0"
          label="Upcoming Sessions"
          color="bg-primary-500"
        />
        <StatCard
          icon={CheckCircle}
          value="0"
          label="Completed Sessions"
          color="bg-success"
        />
      </div>

      <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-6 mb-8 text-white animate-fade-in-up">
        <h3 className="font-semibold text-lg mb-1">Find a Tutor</h3>
        <p className="text-primary-200 text-sm mb-4">
          Search from hundreds of verified peer tutors
        </p>
        <Link
          to="/tutors"
          className="inline-flex items-center gap-2 bg-white text-primary-600 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-50 transition-colors duration-200"
        >
          <Search size={15} />
          Browse Tutors
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-surface-100 shadow-sm p-6 animate-fade-in-up">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-surface-800">
            Your Sessions
          </h2>
        </div>

        <div className="flex flex-col items-center justify-center py-14 text-center">
          <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-4">
            <BookOpen size={28} className="text-primary-400" />
          </div>
          <p className="text-surface-700 font-medium mb-1">No sessions yet</p>
          <p className="text-surface-400 text-sm mb-5">
            Find a tutor and book your first session
          </p>
          <Link
            to="/tutors"
            className="flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
          >
            Find a Tutor
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default StudentDashboard;