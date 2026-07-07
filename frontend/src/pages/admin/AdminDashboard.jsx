import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  Clock,
  CreditCard,
  TrendingUp,
  Star,
  Menu,
  ArrowRight,
  Loader2,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import AdminSidebar from "../../components/AdminSidebar";
import { getAdminStats } from "../../api/adminApi";

const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-surface-100 p-5 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-surface-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-surface-900 mt-1">{value}</p>
        {subtitle && (
          <p className="text-xs text-surface-400 mt-1">{subtitle}</p>
        )}
      </div>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={20} />
      </div>
    </div>
  </div>
);

const statusConfig = {
  pending: { color: "bg-yellow-50 text-yellow-700", icon: Clock },
  accepted: { color: "bg-blue-50 text-blue-700", icon: CheckCircle },
  completed: { color: "bg-green-50 text-green-700", icon: CheckCircle },
  declined: { color: "bg-red-50 text-red-700", icon: XCircle },
  cancelled: { color: "bg-surface-100 text-surface-600", icon: AlertCircle },
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAdminStats();
        setStats(res.data);
      } catch {
        toast.error("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const formatCurrency = (amount) => {
    return `₦${Number(amount || 0).toLocaleString()}`;
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-NG", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-surface-50 flex">
        <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        <main className="flex-1 min-w-0">
          {/* Top Bar */}
          <div className="bg-white border-b border-surface-100 px-6 py-4 sticky top-16 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileOpen(true)}
                  className="lg:hidden p-2 rounded-xl hover:bg-surface-50 text-surface-600"
                >
                  <Menu size={20} />
                </button>
                <div>
                  <h1 className="text-xl font-bold text-surface-900">Dashboard</h1>
                  <p className="text-sm text-surface-500">
                    Overview of platform activity
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 size={28} className="animate-spin text-primary-500" />
              </div>
            ) : stats ? (
              <div className="space-y-6 animate-fade-in">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  <StatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon={Users}
                    color="bg-primary-50 text-primary-600"
                    subtitle={`${stats.totalStudents} students · ${stats.totalTutors} tutors`}
                  />
                  <StatCard
                    title="Total Sessions"
                    value={stats.totalSessions}
                    icon={Calendar}
                    color="bg-blue-50 text-blue-600"
                    subtitle={`${stats.activeSessions} active · ${stats.pendingSessions} pending`}
                  />
                  <StatCard
                    title="Completed Sessions"
                    value={stats.completedSessions}
                    icon={CheckCircle}
                    color="bg-green-50 text-green-600"
                    subtitle={`${stats.totalReviews} reviews submitted`}
                  />
                  <StatCard
                    title="Total Revenue"
                    value={formatCurrency(stats.totalRevenue)}
                    icon={TrendingUp}
                    color="bg-yellow-50 text-yellow-600"
                    subtitle="From successful payments"
                  />
                </div>

                {/* Quick Stats Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white rounded-2xl shadow-sm border border-surface-100 p-4 text-center">
                    <GraduationCap size={20} className="mx-auto text-primary-500 mb-2" />
                    <p className="text-xl font-bold text-surface-900">{stats.totalStudents}</p>
                    <p className="text-xs text-surface-500">Students</p>
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm border border-surface-100 p-4 text-center">
                    <BookOpen size={20} className="mx-auto text-blue-500 mb-2" />
                    <p className="text-xl font-bold text-surface-900">{stats.totalTutors}</p>
                    <p className="text-xs text-surface-500">Tutors</p>
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm border border-surface-100 p-4 text-center">
                    <Star size={20} className="mx-auto text-yellow-500 mb-2" />
                    <p className="text-xl font-bold text-surface-900">{stats.totalReviews}</p>
                    <p className="text-xs text-surface-500">Reviews</p>
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm border border-surface-100 p-4 text-center">
                    <Clock size={20} className="mx-auto text-orange-500 mb-2" />
                    <p className="text-xl font-bold text-surface-900">{stats.pendingSessions}</p>
                    <p className="text-xs text-surface-500">Pending</p>
                  </div>
                </div>

                {/* Recent Sessions */}
                <div className="bg-white rounded-2xl shadow-sm border border-surface-100">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100">
                    <h2 className="font-bold text-surface-900">Recent Sessions</h2>
                    <Link
                      to="/admin/sessions"
                      className="flex items-center gap-1 text-sm text-primary-600 font-medium hover:text-primary-700"
                    >
                      View All <ArrowRight size={14} />
                    </Link>
                  </div>

                  {stats.recentSessions?.length === 0 ? (
                    <div className="px-6 py-12 text-center">
                      <Calendar size={32} className="mx-auto text-surface-300 mb-3" />
                      <p className="text-surface-500 text-sm">No sessions yet</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left border-b border-surface-100">
                            <th className="px-6 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Student</th>
                            <th className="px-6 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Tutor</th>
                            <th className="px-6 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Subject</th>
                            <th className="px-6 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-50">
                          {stats.recentSessions.map((session) => {
                            const config = statusConfig[session.status] || statusConfig.pending;
                            return (
                              <tr key={session._id} className="hover:bg-surface-50 transition-colors">
                                <td className="px-6 py-3.5">
                                  <div className="flex items-center gap-2.5">
                                    {session.student?.profileImage ? (
                                      <img src={session.student.profileImage} alt="" className="w-8 h-8 rounded-full object-cover" />
                                    ) : (
                                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                                        <span className="text-xs font-bold text-primary-600">
                                          {session.student?.name?.charAt(0)}
                                        </span>
                                      </div>
                                    )}
                                    <span className="text-sm font-medium text-surface-800 truncate max-w-[120px]">
                                      {session.student?.name || "Unknown"}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-3.5">
                                  <span className="text-sm text-surface-700 truncate max-w-[120px] block">
                                    {session.tutor?.name || "Unknown"}
                                  </span>
                                </td>
                                <td className="px-6 py-3.5">
                                  <span className="text-sm text-surface-700">{session.subject}</span>
                                </td>
                                <td className="px-6 py-3.5">
                                  <span className="text-sm text-surface-500">{formatDate(session.scheduledDate)}</span>
                                </td>
                                <td className="px-6 py-3.5">
                                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${config.color}`}>
                                    {session.status}
                                  </span>
                                </td>
                                <td className="px-6 py-3.5">
                                  <span className="text-sm font-medium text-surface-800">
                                    {session.amount ? formatCurrency(session.amount) : "—"}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-surface-500">Failed to load stats</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;