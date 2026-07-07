import { useState, useEffect } from "react";
import {
  CreditCard,
  Menu,
  Loader2,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import AdminSidebar from "../../components/AdminSidebar";
import { getAdminPayments } from "../../api/adminApi";

const paymentStatusConfig = {
  pending: { color: "bg-yellow-50 text-yellow-700", label: "Pending" },
  success: { color: "bg-green-50 text-green-700", label: "Success" },
  failed: { color: "bg-red-50 text-red-700", label: "Failed" },
};

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const res = await getAdminPayments({
        page,
        limit: 20,
        status: statusFilter,
      });
      setPayments(res.data.payments);
      setPagination(res.data.pagination);
    } catch {
      toast.error("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, [page, statusFilter]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-NG", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amountInKobo) => {
    return `₦${(Number(amountInKobo) / 100).toLocaleString()}`;
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
                <h1 className="text-xl font-bold text-surface-900">Payments</h1>
                <p className="text-sm text-surface-500">
                  {pagination ? `${pagination.total} total payments` : "All platform payments"}
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
                  { value: "success", label: "Success" },
                  { value: "pending", label: "Pending" },
                  { value: "failed", label: "Failed" },
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
              ) : payments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <CreditCard size={36} className="text-surface-300" />
                  <p className="text-surface-500">No payments found</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b border-surface-100 bg-surface-50">
                          <th className="px-6 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Reference</th>
                          <th className="px-6 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Student</th>
                          <th className="px-6 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider hidden md:table-cell">Tutor</th>
                          <th className="px-6 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider hidden md:table-cell">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-50">
                        {payments.map((payment) => {
                          const config = paymentStatusConfig[payment.status] || paymentStatusConfig.pending;
                          return (
                            <tr key={payment._id} className="hover:bg-surface-50 transition-colors">
                              <td className="px-6 py-3.5">
                                <span className="text-xs font-mono text-surface-600 bg-surface-50 px-2 py-1 rounded">
                                  {payment.reference}
                                </span>
                              </td>
                              <td className="px-6 py-3.5">
                                <div>
                                  <p className="text-sm font-medium text-surface-800">{payment.student?.name || "Unknown"}</p>
                                  <p className="text-xs text-surface-400">{payment.student?.email}</p>
                                </div>
                              </td>
                              <td className="px-6 py-3.5 hidden md:table-cell">
                                <div>
                                  <p className="text-sm text-surface-700">{payment.tutor?.name || "Unknown"}</p>
                                  <p className="text-xs text-surface-400">{payment.tutor?.email}</p>
                                </div>
                              </td>
                              <td className="px-6 py-3.5">
                                <span className="text-sm font-semibold text-surface-900">
                                  {formatCurrency(payment.amount)}
                                </span>
                              </td>
                              <td className="px-6 py-3.5">
                                <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${config.color}`}>
                                  {config.label}
                                </span>
                              </td>
                              <td className="px-6 py-3.5 hidden md:table-cell">
                                <span className="text-sm text-surface-500">
                                  {formatDate(payment.createdAt)}
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

export default AdminPayments;