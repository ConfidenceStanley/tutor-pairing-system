import { GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-surface-100 flex flex-col">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2 w-fit">
          <div className="bg-primary-600 text-white p-1.5 rounded-lg">
            <GraduationCap size={20} />
          </div>
          <span className="font-bold text-lg text-surface-800 tracking-tight">
            Tutor<span className="text-primary-600">Pair</span>
          </span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-10">
        <div className="w-full max-w-md animate-fade-in-up">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;