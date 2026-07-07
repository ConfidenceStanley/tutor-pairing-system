import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Clock,
  Calendar,
  CheckCircle,
  BookOpen,
  Star,
  DollarSign,
  Users,
  Plus,
  TrendingUp,
} from "lucide-react";
import Navbar from "../components/Navbar";
import SessionCard from "../components/SessionCard";
import { useAuth } from "../context/AuthContext";
import { getMySessions } from "../api/sessionApi";

const TABS = [
  { key: "pending", label: "New Requests", icon: Clock },
  { key: "accepted", label: "Upcoming", icon: Calendar },
  { key: "completed", label: "Completed", icon: CheckCircle },
];

const TutorDashboard = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");

  const loadSessions = async () => {
    setLoading(true);
    try {
      const result = await getMySessions();
      setSessions(result.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const filteredSessions = sessions.filter((s) => s.status === activeTab);

  const counts = {
    pending: sessions.filter((s) => s.status === "pending").length,
    accepted: sessions.filter((s) => s.status === "accepted").length,
    completed: sessions.filter((s) => s.status === "completed").length,
  };

  // Total earnings from completed sessions
  const totalEarnings = sessions
    .filter((s) => s.status === "completed")
    .reduce((sum, s) => sum + (s.amount || 0), 0);

  // Unique student count
  const uniqueStudents = new Set(
    sessions.filter((s) => s.status === "completed").map((s) => s.student?._id)
  ).size;

  // Profile setup check
  const profileIncomplete =
    !user?.subjects?.length ||
    !user?.availability?.length ||
    !user?.sessionRate;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-surface-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-surface-900">
              Welcome, {user?.name?.split(" ")[0]}
            </h1>
            <p className="text-surface-500 mt-1">
              Manage session requests and track your teaching activity
            </p>
          </div>

          {/* Setup warning */}
          {profileIncomplete && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                <TrendingUp size={18} className="text-yellow-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-yellow-900 mb-1">
                  Complete your profile to start receiving requests
                </h4>
                <p className="text-sm text-yellow-800 mb-3">
                  Add your subjects, availability, and session rate so students
                  can find and book you.
                </p>
                <div className="flex flex-wrap gap-2">
                  {!user?.subjects?.length && (
                    <Link
                      to="/tutor/subjects"
                      className="text-xs px-3 py-1.5 bg-white border border-yellow-300 text-yellow-800 rounded-lg font-medium hover:bg-yellow-100"
                    >
                      Add Subjects
                    </Link>
                  )}
                  {!user?.availability?.length && (
                    <Link
                      to="/tutor/availability"
                      className="text-xs px-3 py-1.5 bg-white border border-yellow-300 text-yellow-800 rounded-lg font-medium hover:bg-yellow-100"
                    >
                      Set Availability
                    </Link>
                  )}
                  {!user?.sessionRate && (
                    <Link
                      to="/profile/edit"
                      className="text-xs px-3 py-1.5 bg-white border border-yellow-300 text-yellow-800 rounded-lg font-medium hover:bg-yellow-100"
                    >
                      Set Rate
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={Clock}
              label="New Requests"
              value={counts.pending}
              color="yellow"
            />
            <StatCard
              icon={Users}
              label="Students Taught"
              value={uniqueStudents}
              color="blue"
            />
            <StatCard
              icon={Star}
              label="Rating"
              value={
                user?.averageRating > 0 ? user.averageRating.toFixed(1) : "New"
              }
              color="purple"
            />
            <StatCard
              icon={DollarSign}
              label="Total Earned"
              value={`₦${totalEarnings.toLocaleString()}`}
              color="green"
            />
          </div>

          {/* Tabs */}
          <div className="flex overflow-x-auto gap-1 mb-6 bg-white p-1 rounded-2xl border border-surface-100 shadow-sm">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? "bg-primary-600 text-white"
                      : "text-surface-600 hover:bg-surface-50"
                  }`}
                >
                  <Icon size={15} />
                  {tab.label}
                  {counts[tab.key] > 0 && (
                    <span
                      className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-surface-100 text-surface-600"
                      }`}
                    >
                      {counts[tab.key]}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sessions */}
          {loading ? (
            <div className="text-center py-16 text-surface-500">
              Loading sessions...
            </div>
          ) : filteredSessions.length === 0 ? (
            <EmptyState tab={activeTab} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredSessions.map((session) => (
                <SessionCard
                  key={session._id}
                  session={session}
                  viewAs="tutor"
                  onUpdate={loadSessions}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const StatCard = ({ icon: Icon, label, value, color }) => {
  const colors = {
    yellow: "bg-yellow-50 text-yellow-600",
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-primary-50 text-primary-600",
  };
  return (
    <div className="bg-white rounded-2xl border border-surface-100 shadow-sm p-4">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color]}`}
        >
          <Icon size={18} />
        </div>
        <div className="min-w-0">
          <p className="text-lg font-bold text-surface-900 leading-tight truncate">
            {value}
          </p>
          <p className="text-xs text-surface-500 truncate">{label}</p>
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({ tab }) => {
  const messages = {
    pending: {
      title: "No pending requests",
      desc: "New session requests will appear here",
    },
    accepted: {
      title: "No upcoming sessions",
      desc: "Accepted sessions will show up here",
    },
    completed: {
      title: "No completed sessions",
      desc: "Your teaching history will appear here",
    },
  };
  const msg = messages[tab];

  return (
    <div className="bg-white rounded-2xl border border-surface-100 p-12 text-center">
      <div className="w-16 h-16 rounded-full bg-surface-100 flex items-center justify-center mx-auto mb-4">
        <BookOpen size={28} className="text-surface-300" />
      </div>
      <h3 className="font-semibold text-surface-900 mb-1">{msg.title}</h3>
      <p className="text-sm text-surface-500">{msg.desc}</p>
    </div>
  );
};

export default TutorDashboard;