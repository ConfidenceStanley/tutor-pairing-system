import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  Receipt,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { getMyPayments } from "../api/paymentApi";

const STATUS_STYLES = {
  pending: { bg: "bg-yellow-50", text: "text-yellow-700", icon: Clock, label: "Pending" },
  success: { bg: "bg-green-50", text: "text-green-700", icon: CheckCircle, label: "Success" },
  failed: { bg: "bg-red-50", text: "text-red-700", icon: XCircle, label: "Failed" },
};

const PaymentHistory = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getMyPayments();
        setPayments(result.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const totalSpent = payments
    .filter((p) => p.status === "success")
    .reduce((sum, p) => sum + p.amount / 100, 0);

  const dashboardPath =
    user?.role === "tutor" ? "/tutor/dashboard" : "/student/dashboard";

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-surface-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            to={dashboardPath}
            className="inline-flex items-center gap-2 text-surface-600 hover:text-primary-600 mb-6 text-sm font-medium transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-surface-900">
              {user?.role === "tutor" ? "Earnings" : "Payment History"}
            </h1>
            <p className="text-surface-500 mt-1">
              {user?.role === "tutor"
                ? "All successful payments received"
                : "All your transactions on TutorPair"}
            </p>
          </div>

          {/* Total card */}
          <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-2 text-primary-100 text-sm mb-1">
              <Receipt size={14} />
              {user?.role === "tutor" ? "Total Earned" : "Total Spent"}
            </div>
            <p className="text-4xl font-bold">
              ₦{totalSpent.toLocaleString()}
            </p>
            <p className="text-primary-100 text-sm mt-2">
              {payments.filter((p) => p.status === "success").length} successful{" "}
              {payments.filter((p) => p.status === "success").length === 1
                ? "transaction"
                : "transactions"}
            </p>
          </div>

          {/* Payments list */}
          {loading ? (
            <div className="text-center py-16 text-surface-500">
              Loading payments...
            </div>
          ) : payments.length === 0 ? (
            <div className="bg-white rounded-2xl border border-surface-100 p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-surface-100 flex items-center justify-center mx-auto mb-4">
                <CreditCard size={28} className="text-surface-300" />
              </div>
              <h3 className="font-semibold text-surface-900 mb-1">
                No payments yet
              </h3>
              <p className="text-sm text-surface-500">
                Your transaction history will appear here
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-surface-100 shadow-sm overflow-hidden">
              {payments.map((payment, idx) => {
                const style = STATUS_STYLES[payment.status];
                const Icon = style.icon;
                const otherParty =
                  user?.role === "tutor" ? payment.student : payment.tutor;
                return (
                  <div
                    key={payment._id}
                    className={`p-5 flex items-center gap-4 ${
                      idx !== payments.length - 1
                        ? "border-b border-surface-100"
                        : ""
                    } hover:bg-surface-50 transition-colors`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${style.bg} ${style.text} flex-shrink-0`}
                    >
                      <Icon size={18} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-surface-900 truncate">
                          {payment.session?.subject ||
                            payment.bookingData?.subject ||
                            "Session"}
                        </p>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${style.bg} ${style.text} font-medium`}
                        >
                          {style.label}
                        </span>
                      </div>
                      <p className="text-sm text-surface-500 truncate">
                        {user?.role === "tutor" ? "From" : "To"}:{" "}
                        {otherParty?.name || "Unknown"}
                      </p>
                      <p className="text-xs text-surface-400 mt-0.5">
                        {formatDate(payment.createdAt)} · Ref: {payment.reference}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-lg font-bold text-surface-900">
                        ₦{(payment.amount / 100).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PaymentHistory;