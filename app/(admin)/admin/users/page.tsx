'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  ShieldAlert, 
  Download, 
  UserPlus,
  CheckCircle2,
  XCircle,
  Eye,
  Loader2
} from 'lucide-react';
import { getAllUsersAction } from '@/actions/user'; // Import server action

interface User {
  _id: string;
  username: string;
  fullName: string;
  email: string;
  isAdmin: boolean;
  isActive: boolean;
  isBanned: boolean;
  createdAt: string;
  profileImage?: string;
  stats?: {
    followersCount: number;
    videosCount: number;
  };
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    pages: 0
  });
  
  const router = useRouter();

  // Fetch users function
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      // Map UI filters to API params
      let isActive: boolean | undefined = undefined;
      let isBanned: boolean | undefined = undefined;
      
      if (selectedStatus === 'active') {
        isActive = true;
        isBanned = false;
      } else if (selectedStatus === 'suspended') {
        isActive = false;
        isBanned = true;
      }
      
      let role: string | undefined = undefined;
      if (selectedRole !== 'all') {
        role = selectedRole === 'creator' ? 'creator' : selectedRole;
      }

      const result = await getAllUsersAction({
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery || undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        isActive,
        isBanned,
        role
      });
      
      if (result.success && result.data) {
        const { users, pagination } = result.data;
        setUsers(users);
        setPagination(prev => ({
          ...prev,
          total: pagination.total,
          pages: pagination.pages
        }));
      } else {
        console.error('Failed to fetch users:', result.error);
        // Optionally show toast error
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, searchQuery, selectedRole, selectedStatus]);

  // Fetch when dependencies change
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle search with debounce
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on new search
  };

  // Handle role filter change
  const handleRoleChange = (value: string) => {
    setSelectedRole(value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Handle status filter change
  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  // Navigate to user details
  const handleUserClick = (userId: string) => {
    router.push(`/admin/users/${userId}`);
  };

  // Action handlers
  const handleEdit = (e: React.MouseEvent, userId: string) => {
    e.stopPropagation();
    router.push(`/admin/users/${userId}/edit`);
  };

  const handleSuspend = async (e: React.MouseEvent, userId: string, currentStatus: boolean) => {
    e.stopPropagation();
    // You'll need a separate server action for suspend/ban

  };

  const handleDelete = async (e: React.MouseEvent, userId: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this user?')) {
      // Call delete action
    }
  };

  // Helper to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Helper to get initials from name
  const getInitials = (fullName: string, username: string) => {
    if (fullName && fullName.length > 0) {
      return fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return username.slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Page Header (same as before) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">User Management</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">Manage your platform users, roles, and account statuses.</p>
        </div>
       
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:max-w-md">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Search by name, handle, or email..." 
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all text-sm font-medium"
          />
        </div>
        {/* <div className="flex items-center gap-3">
          <select 
            value={selectedRole}
            onChange={(e) => handleRoleChange(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 appearance-none min-w-[120px]"
          >
            <option value="all">All Roles</option>
            <option value="user">Users</option>
            <option value="creator">Creators</option>
            <option value="moderator">Moderators</option>
          </select>
          <select 
            value={selectedStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 appearance-none min-w-[120px]"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
          <button 
            onClick={() => fetchUsers()}
            className="p-2.5 bg-gray-50 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <Filter size={18} />
          </button>
        </div> */}
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User Details</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Joined Date</th>
                {/* <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-yellow-500 mx-auto" />
                    <p className="mt-2 text-gray-500">Loading users...</p>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr 
                    key={user._id} 
                    onClick={() => handleUserClick(user._id)}
                    className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-900 text-yellow-500 flex items-center justify-center font-bold text-sm shrink-0">
                          {user.profileImage ? (
                            <img src={user.profileImage} alt="" className="w-full h-full rounded-full object-cover" />
                          ) : (
                            getInitials(user.fullName, user.username)
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 flex items-center gap-1 group-hover:text-yellow-600 transition-colors">
                            {user.fullName || user.username}
                            {user.isAdmin && <CheckCircle2 size={14} className="text-blue-500" />}
                          </div>
                          <div className="text-sm font-medium text-gray-500">
                            @{user.username} • {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2.5 py-1 rounded-lg text-xs font-bold">
                        {user.isAdmin ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
                        user.isActive && !user.isBanned ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {user.isActive && !user.isBanned ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {user.isActive && !user.isBanned ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-600">
                      {formatDate(user.createdAt)}
                    </td>
                    {/* <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleUserClick(user._id); }}
                          className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors" 
                          title="View Profile"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={(e) => handleEdit(e, user._id)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                          title="Edit User"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={(e) => handleSuspend(e, user._id, user.isActive)}
                          className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" 
                          title={user.isActive ? "Suspend User" : "Unsuspend User"}
                        >
                          <ShieldAlert size={16} />
                        </button>
                        <button 
                          onClick={(e) => handleDelete(e, user._id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                          title="Delete User"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td> */}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        {!loading && users.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
            <p className="text-sm font-medium text-gray-500">
              Showing <span className="font-bold text-gray-900">
                {(pagination.page - 1) * pagination.limit + 1}
              </span> to <span className="font-bold text-gray-900">
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </span> of <span className="font-bold text-gray-900">{pagination.total}</span> users
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-1.5 border border-gray-200 text-gray-500 rounded-lg text-sm font-bold hover:bg-white disabled:opacity-50 transition-colors"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                let pageNum = pagination.page;
                if (pagination.pages <= 5) pageNum = i + 1;
                else if (pagination.page <= 3) pageNum = i + 1;
                else if (pagination.page >= pagination.pages - 2) pageNum = pagination.pages - 4 + i;
                else pageNum = pagination.page - 2 + i;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                      pagination.page === pageNum
                        ? 'bg-yellow-500 text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button 
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="px-3 py-1.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-white bg-white shadow-sm transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}