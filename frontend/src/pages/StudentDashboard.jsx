import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  BookOpen,
  Star,
  Plus,
} from "lucide-react";
import Navbar from "../components/Navbar";
import SessionCard from "../components/SessionCard";
import { useAuth } from "../context/AuthContext";
import { getMySessions } from "../api/sessionApi";

const TABS = [
  { key: "pending", label: "Pending", icon: Clock },
  { key: "accepted", label: "Upcoming", icon: Calendar },
  { key: "completed", label: "Completed", icon: CheckCircle },
  { key: "cancelled", label: "Cancelled", icon: XCircle },
];

const StudentDashboard = () => {
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

  // Filter sessions by tab (accepted includes accepted status)
  const filteredSessions = sessions.filter((s) => {
    if (activeTab === "cancelled") {
      return s.status === "cancelled" || s.status === "declined";
    }
    return s.status === activeTab;
  });

  // Counts per status
  const counts = {
    pending: sessions.filter((s) => s.status === "pending").length,
    accepted: sessions.filter((s) => s.status === "accepted").length,
    completed: sessions.filter((s) => s.status === "completed").length,
    cancelled: sessions.filter(
      (s) => s.status === "cancelled" || s.status === "declined"
    ).length,
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-surface-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-surface-900">
                Welcome back, {user?.name?.split(" ")[0]}
              </h1>
              <p className="text-surface-500 mt-1">
                Track your tutoring sessions and find new tutors
              </p>
            </div>
            <Link
              to="/tutors"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors shadow-sm"
            >
              <Search size={16} />
              Find a Tutor
            </Link>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={Clock}
              label="Pending"
              value={counts.pending}
              color="yellow"
            />
            <StatCard
              icon={Calendar}
              label="Upcoming"
              value={counts.accepted}
              color="blue"
            />
            <StatCard
              icon={CheckCircle}
              label="Completed"
              value={counts.completed}
              color="green"
            />
            <StatCard
              icon={BookOpen}
              label="Total"
              value={sessions.length}
              color="purple"
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
                  viewAs="student"
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

// Stat card component
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
        <div>
          <p className="text-2xl font-bold text-surface-900 leading-tight">
            {value}
          </p>
          <p className="text-xs text-surface-500">{label}</p>
        </div>
      </div>
    </div>
  );
};

// Empty state
const EmptyState = ({ tab }) => {
  const messages = {
    pending: "No pending session requests",
    accepted: "No upcoming sessions",
    completed: "No completed sessions yet",
    cancelled: "No cancelled or declined sessions",
  };

  return (
    <div className="bg-white rounded-2xl border border-surface-100 p-12 text-center">
      <div className="w-16 h-16 rounded-full bg-surface-100 flex items-center justify-center mx-auto mb-4">
        <Calendar size={28} className="text-surface-300" />
      </div>
      <h3 className="font-semibold text-surface-900 mb-1">{messages[tab]}</h3>
      <p className="text-sm text-surface-500 mb-5">
        {tab === "pending"
          ? "Book a session with a tutor to get started"
          : "Sessions will appear here once available"}
      </p>
      {tab === "pending" && (
        <Link
          to="/tutors"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700"
        >
          <Plus size={14} />
          Find a Tutor
        </Link>
      )}
    </div>
  );
};

export default StudentDashboard;