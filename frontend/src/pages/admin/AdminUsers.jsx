import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Search,
  Menu,
  Loader2,
  Eye,
  UserRound,
  ChevronLeft,
  ChevronRight,
  Check,
  XCircle,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import AdminSidebar from "../../components/AdminSidebar";
import {
  getAdminUsers,
  activateUser,
  deactivateUser,
  deleteUser,
} from "../../api/adminApi";

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [actionLoading, setActionLoading] = useState("");
  const [deleteModal, setDeleteModal] = useState(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await getAdminUsers({
        page,
        limit: 20,
        search,
        role: roleFilter,
      });
      setUsers(res.data.users);
      setPagination(res.data.pagination);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [page, roleFilter]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      loadUsers();
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const handleToggleActive = async (userId, isActive) => {
    try {
      setActionLoading(userId);
      if (isActive) {
        await deactivateUser(userId);
        toast.success("User deactivated");
      } else {
        await activateUser(userId);
        toast.success("User activated");
      }
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setActionLoading("");
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    try {
      setActionLoading(deleteModal._id);
      await deleteUser(deleteModal._id);
      toast.success(`${deleteModal.name} deleted`);
      setDeleteModal(null);
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setActionLoading("");
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
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
                <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-surface-50 text-surface-600">
                  <Menu size={20} />
                </button>
                <div>
                  <h1 className="text-xl font-bold text-surface-900">Users</h1>
                  <p className="text-sm text-surface-500">
                    {pagination ? `${pagination.total} total users` : "Manage platform users"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="px-6 pt-6 pb-4">
            <div className="bg-white rounded-2xl shadow-sm border border-surface-100 p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                  <input
                    type="text"
                    placeholder="Search by name, email, or department..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={roleFilter}
                  onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
                  className="px-4 py-2.5 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-surface-700"
                >
                  <option value="">All Roles</option>
                  <option value="student">Students</option>
                  <option value="tutor">Tutors</option>
                </select>
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
              ) : users.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <Users size={36} className="text-surface-300" />
                  <p className="text-surface-500">No users found</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b border-surface-100 bg-surface-50">
                          <th className="px-6 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">User</th>
                          <th className="px-6 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider hidden md:table-cell">Role</th>
                          <th className="px-6 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider hidden lg:table-cell">Department</th>
                          <th className="px-6 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider hidden md:table-cell">Joined</th>
                          <th className="px-6 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-50">
                        {users.map((u) => (
                          <tr key={u._id} className="hover:bg-surface-50 transition-colors">
                            <td className="px-6 py-3.5">
                              <div className="flex items-center gap-3">
                                {u.profileImage ? (
                                  <img src={u.profileImage} alt="" className="w-9 h-9 rounded-full object-cover" />
                                ) : (
                                  <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center">
                                    <span className="text-xs font-bold text-primary-600">{getInitials(u.name)}</span>
                                  </div>
                                )}
                                <span className="text-sm font-medium text-surface-900 truncate max-w-[140px]">{u.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-3.5">
                              <span className="text-sm text-surface-600 truncate max-w-[160px] block">{u.email}</span>
                            </td>
                            <td className="px-6 py-3.5 hidden md:table-cell">
                              <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                                u.role === "tutor" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"
                              }`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="px-6 py-3.5 hidden lg:table-cell">
                              <span className="text-sm text-surface-600 truncate max-w-[140px] block">{u.department}</span>
                            </td>
                            <td className="px-6 py-3.5">
                              <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                                u.isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                              }`}>
                                {u.isActive ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="px-6 py-3.5 hidden md:table-cell">
                              <span className="text-sm text-surface-500">{formatDate(u.createdAt)}</span>
                            </td>
                            <td className="px-6 py-3.5">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => navigate(`/admin/users/${u._id}`)}
                                  className="p-2 rounded-lg hover:bg-primary-50 text-surface-500 hover:text-primary-600 transition-colors"
                                  title="View"
                                >
                                  <Eye size={15} />
                                </button>
                                <button
                                  onClick={() => handleToggleActive(u._id, u.isActive)}
                                  disabled={actionLoading === u._id}
                                  className={`p-2 rounded-lg transition-colors ${
                                    u.isActive
                                      ? "hover:bg-yellow-50 text-surface-500 hover:text-yellow-600"
                                      : "hover:bg-green-50 text-surface-500 hover:text-green-600"
                                  }`}
                                  title={u.isActive ? "Deactivate" : "Activate"}
                                >
                                  {actionLoading === u._id ? (
                                    <Loader2 size={15} className="animate-spin" />
                                  ) : u.isActive ? (
                                    <XCircle size={15} />
                                  ) : (
                                    <Check size={15} />
                                  )}
                                </button>
                                <button
                                  onClick={() => setDeleteModal(u)}
                                  className="p-2 rounded-lg hover:bg-red-50 text-surface-500 hover:text-red-600 transition-colors"
                                  title="Delete"
                                >
                                  <AlertCircle size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
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

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 animate-scale-in">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={24} className="text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-surface-900 text-center mb-2">
              Delete User
            </h3>
            <p className="text-sm text-surface-500 text-center mb-6">
              Are you sure you want to delete <strong>{deleteModal.name}</strong>?
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal(null)}
                className="flex-1 px-4 py-2.5 border border-surface-200 rounded-xl text-sm font-medium text-surface-700 hover:bg-surface-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={actionLoading === deleteModal._id}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {actionLoading === deleteModal._id ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : null}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminUsers;