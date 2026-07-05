import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../context/AuthContext";
import { BookOpen, Clock, CheckCircle } from "lucide-react";

const StudentDashboard = () => {
  const { user } = useAuth();

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, {user?.name}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Here is your learning overview
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-lg">
            <Clock size={22} className="text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">0</p>
            <p className="text-sm text-gray-500">Pending Requests</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-lg">
            <BookOpen size={22} className="text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">0</p>
            <p className="text-sm text-gray-500">Upcoming Sessions</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="bg-purple-100 p-3 rounded-lg">
            <CheckCircle size={22} className="text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">0</p>
            <p className="text-sm text-gray-500">Completed Sessions</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Your Sessions
        </h2>
        <div className="text-center py-10 text-gray-400">
          <BookOpen size={40} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">No sessions yet. Find a tutor to get started.</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default StudentDashboard;