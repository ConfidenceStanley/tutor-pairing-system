import { useEffect, useState, useRef } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  Loader2,
  ArrowRight,
  Home,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { verifyPayment } from "../api/paymentApi";

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("verifying"); // verifying | success | failed
  const [message, setMessage] = useState("");
  const [session, setSession] = useState(null);

  // Prevent double-verify on React strict mode / re-render
  const verifiedRef = useRef(false);

  useEffect(() => {
    if (verifiedRef.current) return;
    verifiedRef.current = true;

    const reference =
      searchParams.get("reference") ||
      searchParams.get("trxref") ||
      localStorage.getItem("pendingPaymentRef");

    if (!reference) {
      setStatus("failed");
      setMessage("No payment reference found");
      return;
    }

    const run = async () => {
      try {
        const result = await verifyPayment(reference);
        localStorage.removeItem("pendingPaymentRef");

        if (result.success && result.data?.session) {
          setStatus("success");
          setSession(result.data.session);
          setMessage("Your session request has been sent to the tutor.");
        } else {
          setStatus("failed");
          setMessage(result.message || "Payment was not successful");
        }
      } catch (err) {
        setStatus("failed");
        setMessage(
          err.response?.data?.message ||
            "Could not verify payment. Please contact support."
        );
      }
    };

    run();
  }, [searchParams]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-surface-100 max-w-md w-full p-8 text-center animate-fade-in-up">
          {status === "verifying" && (
            <>
              <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-4">
                <Loader2 size={32} className="text-primary-600 animate-spin" />
              </div>
              <h1 className="text-xl font-bold text-surface-900 mb-2">
                Verifying Payment...
              </h1>
              <p className="text-surface-500 text-sm">
                Please wait while we confirm your transaction. Do not close this
                window.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h1 className="text-xl font-bold text-surface-900 mb-2">
                Payment Successful!
              </h1>
              <p className="text-surface-500 text-sm mb-6">{message}</p>

              {session && (
                <div className="p-4 bg-surface-50 rounded-xl mb-6 text-left">
                  <div className="text-xs text-surface-400 mb-1">Tutor</div>
                  <p className="font-semibold text-surface-900 mb-2">
                    {session.tutor?.name}
                  </p>
                  <div className="text-xs text-surface-400 mb-1">Subject</div>
                  <p className="text-sm text-surface-700 mb-2">
                    {session.subject}
                  </p>
                  <div className="text-xs text-surface-400 mb-1">
                    Amount Paid
                  </div>
                  <p className="text-lg font-bold text-primary-600">
                    ₦{session.amount?.toLocaleString()}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <button
                  onClick={() => navigate("/student/dashboard")}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
                >
                  Go to Dashboard
                  <ArrowRight size={16} />
                </button>
                <Link
                  to="/tutors"
                  className="w-full flex items-center justify-center gap-2 py-2.5 border border-surface-200 text-surface-700 rounded-xl font-medium hover:bg-surface-50 transition-colors"
                >
                  Browse More Tutors
                </Link>
              </div>
            </>
          )}

          {status === "failed" && (
            <>
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <XCircle size={32} className="text-red-600" />
              </div>
              <h1 className="text-xl font-bold text-surface-900 mb-2">
                Payment Failed
              </h1>
              <p className="text-surface-500 text-sm mb-6">{message}</p>

              <div className="space-y-2">
                <button
                  onClick={() => navigate("/tutors")}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
                >
                  Try Again
                </button>
                <Link
                  to="/"
                  className="w-full flex items-center justify-center gap-2 py-2.5 border border-surface-200 text-surface-700 rounded-xl font-medium hover:bg-surface-50 transition-colors"
                >
                  <Home size={16} />
                  Home
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default PaymentCallback;