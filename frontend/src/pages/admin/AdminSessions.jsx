import { useState, useEffect } from "react";
import {
  Calendar,
  Search,
  Menu,
  Loader2,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import AdminSidebar from "../../components/AdminSidebar";
import { getAdminSessions } from "../../api/adminApi";

const statusConfig = {
  pending: { color: "bg-yellow-50 text-yellow-700", label: "Pending" },
  accepted: { color: "bg-blue-50 text-blue-700", label: "Accepted" },
  completed: { color: "bg-green-50 text-green-700", label: "Completed" },
  declined: { color: "bg-red-50 text-red-700", label: "Declined" },
  cancelled: { color: "bg-surface-100 text-surface-600", label: "Cancelled" },
};

const AdminSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const res = await getAdminSessions({
        page,
        limit: 20,
        status: statusFilter,
      });
      setSessions(res.data.sessions);
      setPagination(res.data.pagination);
    } catch {
      toast.error("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, [page, statusFilter]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-NG", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return amount ? `₦${Number(amount).toLocaleString()}` : "—";
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-surface-50 flex">
        <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        <main className="flex-1 min-w-0">
          {/* Top Bar */}
          <div className="bg-white border-b border-surface-100 px-6 py-4 sticky top-16 z-10">
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-surface-50 text-surface-600">
                <Menu size={20} />
              </button>
              <div>
                <h1 className="text-xl font-bold text-surface-900">Sessions</h1>
                <p className="text-sm text-surface-500">
                  {pagination ? `${pagination.total} total sessions` : "All platform sessions"}
                </p>
              </div>
            </div>
          </div>

          {/* Filter */}
          <div className="px-6 pt-6 pb-4">
            <div className="bg-white rounded-2xl shadow-sm border border-surface-100 p-4">
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "", label: "All" },
                  { value: "pending", label: "Pending" },
                  { value: "accepted", label: "Accepted" },
                  { value: "completed", label: "Completed" },
                  { value: "declined", label: "Declined" },
                  { value: "cancelled", label: "Cancelled" },
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => { setStatusFilter(item.value); setPage(1); }}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      statusFilter === item.value
                        ? "bg-primary-600 text-white"
                        : "bg-surface-50 text-surface-600 hover:bg-surface-100"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="px-6 pb-6">
            <div className="bg-white rounded-2xl shadow-sm border border-surface-100 overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center h-48">
                  <Loader2 size={24} className="animate-spin text-primary-500" />
                </div>
              ) : sessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <Calendar size={36} className="text-surface-300" />
                  <p className="text-surface-500">No sessions found</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b border-surface-100 bg-surface-50">
                          <th className="px-6 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Student</th>
                          <th className="px-6 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Tutor</th>
                          <th className="px-6 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Subject</th>
                          <th className="px-6 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider hidden md:table-cell">Date</th>
                          <th className="px-6 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider hidden lg:table-cell">Time</th>
                          <th className="px-6 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider hidden md:table-cell">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-50">
                        {sessions.map((session) => {
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
                              <td className="px-6 py-3.5 hidden md:table-cell">
                                <span className="text-sm text-surface-500">{formatDate(session.scheduledDate)}</span>
                              </td>
                              <td className="px-6 py-3.5 hidden lg:table-cell">
                                <span className="text-sm text-surface-500">{session.scheduledTime}</span>
                              </td>
                              <td className="px-6 py-3.5">
                                <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${config.color}`}>
                                  {config.label}
                                </span>
                              </td>
                              <td className="px-6 py-3.5 hidden md:table-cell">
                                <span className="text-sm font-medium text-surface-800">
                                  {formatCurrency(session.amount)}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {pagination && pagination.pages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-surface-100">
                      <p className="text-sm text-surface-500">
                        Page {pagination.page} of {pagination.pages}
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          disabled={page === 1}
                          className="p-2 rounded-xl border border-surface-200 hover:bg-surface-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <button
                          onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                          disabled={page === pagination.pages}
                          className="p-2 rounded-xl border border-surface-200 hover:bg-surface-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminSessions;