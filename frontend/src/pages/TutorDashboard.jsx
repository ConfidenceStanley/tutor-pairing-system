import { Users, Clock, Star, CheckCircle, TrendingUp } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../context/AuthContext";

const StatCard = ({ icon: Icon, value, label, color, sub }) => (
  <div className="bg-white rounded-2xl p-5 border border-surface-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow duration-200">
    <div className={`${color} p-3 rounded-xl`}>
      <Icon size={20} className="text-white" />
    </div>
    <div>
      <p className="text-2xl font-bold text-surface-800">{value}</p>
      <p className="text-sm text-surface-500">{label}</p>
      {sub && <p className="text-xs text-primary-500 font-medium">{sub}</p>}
    </div>
  </div>
);

const TutorDashboard = () => {
  const { user } = useAuth();

  return (
    <MainLayout>
      <div className="mb-8 animate-fade-in-up">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-surface-900">
              Welcome back, {user?.name?.split(" ")[0]}
            </h1>
            <p className="text-surface-500 text-sm mt-1">
              Here is your tutoring overview
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-primary-50 border border-primary-100 px-4 py-2 rounded-xl">
            <Star size={15} className="text-warning fill-warning" />
            <span className="text-sm font-semibold text-surface-700">
              {user?.averageRating > 0 ? user.averageRating.toFixed(1) : "New"}
            </span>
            <span className="text-xs text-surface-400">
              ({user?.totalReviews || 0} reviews)
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 animate-fade-in-up">
        <StatCard
          icon={Clock}
          value="0"
          label="Pending Requests"
          color="bg-warning"
        />
        <StatCard
          icon={Users}
          value="0"
          label="Upcoming Sessions"
          color="bg-primary-500"
        />
        <StatCard
          icon={CheckCircle}
          value="0"
          label="Completed"
          color="bg-success"
        />
        <StatCard
          icon={TrendingUp}
          value="₦0"
          label="Total Earned"
          color="bg-surface-700"
        />
      </div>

      {user?.subjects?.length > 0 && (
        <div className="bg-white rounded-2xl border border-surface-100 shadow-sm p-6 mb-6 animate-fade-in-up">
          <h3 className="text-sm font-semibold text-surface-700 mb-3">
            Subjects You Teach
          </h3>
          <div className="flex flex-wrap gap-2">
            {user.subjects.map((subject) => (
              <span
                key={subject}
                className="bg-primary-50 text-primary-700 text-xs font-medium px-3 py-1.5 rounded-full border border-primary-100"
              >
                {subject}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-surface-100 shadow-sm p-6 animate-fade-in-up">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-surface-800">
            Incoming Requests
          </h2>
        </div>

        <div className="flex flex-col items-center justify-center py-14 text-center">
          <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-4">
            <Users size={28} className="text-primary-400" />
          </div>
          <p className="text-surface-700 font-medium mb-1">No requests yet</p>
          <p className="text-surface-400 text-sm">
            Complete your profile to start receiving session requests
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default TutorDashboard;