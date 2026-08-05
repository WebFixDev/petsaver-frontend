'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Video, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown,
  ArrowUpDown,
  Calendar,
  X
} from 'lucide-react';
import { getAllUsersAction } from '@/actions/user';
import CustomDateRangePicker from '@/components/admin/CustomDateRangePicker';

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
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // 🟢 User Filtration States
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'suspended'>('all');
  const [videoFilter, setVideoFilter] = useState<'all' | 'has_videos' | 'no_videos'>('all');
  const [datePreset, setDatePreset] = useState<'all' | 'today' | '7days' | '30days' | 'custom'>('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    pages: 0
  });
  
  const router = useRouter();

  // Compute calculated dates from preset
  const getCalculatedDates = useCallback(() => {
    let calcFrom = fromDate;
    let calcTo = toDate;

    if (datePreset === 'today') {
      const d = new Date();
      calcFrom = d.toISOString().split('T')[0];
      calcTo = d.toISOString().split('T')[0];
    } else if (datePreset === '7days') {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      calcFrom = d.toISOString().split('T')[0];
      calcTo = new Date().toISOString().split('T')[0];
    } else if (datePreset === '30days') {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      calcFrom = d.toISOString().split('T')[0];
      calcTo = new Date().toISOString().split('T')[0];
    }

    return { calcFrom, calcTo };
  }, [datePreset, fromDate, toDate]);

  // Debounce search query changes only
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // 🟢 Fetch users function (Called EXACTLY ONCE when debounced search or filters change)
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      let isActive: boolean | undefined = undefined;
      let isBanned: boolean | undefined = undefined;
      
      if (selectedStatus === 'active') {
        isActive = true;
        isBanned = false;
      } else if (selectedStatus === 'suspended') {
        isActive = false;
        isBanned = true;
      }

      const { calcFrom, calcTo } = getCalculatedDates();

      const result = await getAllUsersAction({
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch || undefined,
        sortBy: 'createdAt',
        sortOrder,
        isActive,
        isBanned,
        fromDate: calcFrom || undefined,
        toDate: calcTo || undefined,
      });
      
      if (result.success && result.data) {
        let fetchedUsers: User[] = result.data.users;

        // Apply client-side date range filtering fallback if selected
        if (calcFrom || calcTo) {
          fetchedUsers = fetchedUsers.filter(u => {
            if (!u.createdAt) return false;
            const uDateStr = new Date(u.createdAt).toISOString().split('T')[0];
            if (calcFrom && uDateStr < calcFrom) return false;
            if (calcTo && uDateStr > calcTo) return false;
            return true;
          });
        }

        // Apply client-side video activity filtering if selected
        if (videoFilter === 'has_videos') {
          fetchedUsers = fetchedUsers.filter(u => (u.stats?.videosCount || 0) > 0);
        } else if (videoFilter === 'no_videos') {
          fetchedUsers = fetchedUsers.filter(u => (u.stats?.videosCount || 0) === 0);
        }

        setUsers(fetchedUsers);
        setPagination(prev => ({
          ...prev,
          total: result.data?.pagination.total || fetchedUsers.length,
          pages: result.data?.pagination.pages || 1
        }));
      } else {
        console.error('Failed to fetch users:', result.error);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearch, selectedStatus, videoFilter, datePreset, fromDate, toDate, sortOrder, getCalculatedDates]);

  // Single Effect trigger to prevent double-loading!
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Reset to page 1 on filter changes
  const handleFilterResetPage = () => {
    if (pagination.page !== 1) {
      setPagination(prev => ({ ...prev, page: 1 }));
    }
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

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setDebouncedSearch('');
    setSelectedStatus('all');
    setVideoFilter('all');
    setDatePreset('all');
    setFromDate('');
    setToDate('');
    setSortOrder('desc');
    setPagination(prev => ({ ...prev, page: 1 }));
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
    return (username || 'U').slice(0, 2).toUpperCase();
  };

  const activeFiltersCount = 
    (selectedStatus !== 'all' ? 1 : 0) +
    (videoFilter !== 'all' ? 1 : 0) +
    (datePreset !== 'all' ? 1 : 0) +
    (sortOrder !== 'desc' ? 1 : 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">User Management</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">Review users, uploaded video counts, joined dates, and account status.</p>
        </div>
        <button
          type="button"
          onClick={() => fetchUsers()}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition shadow-sm cursor-pointer"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin text-yellow-600' : 'text-gray-500'} />
          Refresh
        </button>
      </div>

      {/* 🟢 Search & Advanced Filtration Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Search by name, handle, or email..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleFilterResetPage();
              }}
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all text-sm font-medium"
            />
          </div>

          {/* Quick Filter Selectors */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Status Filter */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value as any);
                  handleFilterResetPage();
                }}
                className="appearance-none pl-3.5 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
              >
                <option value="all">Status: All Status</option>
                <option value="active">Active Only</option>
                <option value="suspended">Suspended Only</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Video Activity Filter */}
            <div className="relative">
              <select
                value={videoFilter}
                onChange={(e) => {
                  setVideoFilter(e.target.value as any);
                  handleFilterResetPage();
                }}
                className="appearance-none pl-3.5 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
              >
                <option value="all">Videos: All Users</option>
                <option value="has_videos">Has Uploaded Videos</option>
                <option value="no_videos">No Uploads (0)</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* 🟢 Sort Order Toggle Button (Oper Nechy / Nechy Oper) */}
            <button
              type="button"
              onClick={() => {
                setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
                handleFilterResetPage();
              }}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-800 hover:bg-gray-100 transition-all shadow-sm cursor-pointer min-w-[150px] justify-center"
              title={sortOrder === 'desc' ? "Newest First (Click for Oldest First)" : "Oldest First (Click for Newest First)"}
            >
              <ArrowUpDown size={16} className="text-yellow-600 shrink-0" />
              <span>{sortOrder === 'desc' ? 'Newest First (↓)' : 'Oldest First (↑)'}</span>
            </button>

            {/* Date Range Picker Dropdown */}
            <div className="w-48 sm:w-56">
              <CustomDateRangePicker
                datePreset={datePreset}
                fromDate={fromDate}
                toDate={toDate}
                onChange={(preset, from, to) => {
                  setDatePreset(preset);
                  setFromDate(from);
                  setToDate(to);
                  handleFilterResetPage();
                }}
              />
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {activeFiltersCount > 0 && (
          <div className="pt-3 border-t border-gray-100 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-gray-400">Active Filters:</span>

            {selectedStatus !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-900 border border-green-200 rounded-lg text-xs font-bold">
                Status: {selectedStatus}
                <X size={13} className="cursor-pointer hover:text-red-600 transition" onClick={() => setSelectedStatus('all')} />
              </span>
            )}

            {videoFilter !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-50 text-yellow-900 border border-yellow-200 rounded-lg text-xs font-bold">
                <Video size={12} className="text-yellow-600" />
                Videos: {videoFilter === 'has_videos' ? 'Uploaded Videos' : 'No Uploads'}
                <X size={13} className="cursor-pointer hover:text-red-600 transition" onClick={() => setVideoFilter('all')} />
              </span>
            )}

            {datePreset !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-900 border border-purple-200 rounded-lg text-xs font-bold">
                <Calendar size={12} className="text-purple-600" />
                Joined Date: {datePreset}
                <X size={13} className="cursor-pointer hover:text-red-600 transition" onClick={() => { setDatePreset('all'); setFromDate(''); setToDate(''); }} />
              </span>
            )}

            {sortOrder !== 'desc' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg text-xs font-bold">
                <ArrowUpDown size={12} className="text-blue-600" />
                Sort: Oldest First (↑)
                <X size={13} className="cursor-pointer hover:text-red-600 transition" onClick={() => setSortOrder('desc')} />
              </span>
            )}

            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-bold text-red-600 hover:text-red-700 underline ml-auto cursor-pointer"
            >
              Reset All
            </button>
          </div>
        )}
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User Details</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Video size={14} className="text-yellow-600" /> No. of Videos
                  </span>
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-yellow-500 mx-auto" />
                    <p className="mt-2 text-gray-500 font-medium">Loading users...</p>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500 font-medium">
                    No users found matching your filters.
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const videoCount = user.stats?.videosCount || 0;

                  return (
                    <tr 
                      key={user._id} 
                      onClick={() => handleUserClick(user._id)}
                      className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                    >
                      {/* User Details */}
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
                            <div className="font-bold text-gray-900 flex items-center gap-1.5 group-hover:text-yellow-600 transition-colors">
                              {user.fullName || user.username}
                              {user.isAdmin && (
                                <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-extrabold rounded">
                                  ADMIN
                                </span>
                              )}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                              @{user.username} • {user.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Video Count Badge */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-extrabold ${
                          videoCount > 0
                            ? 'bg-yellow-50 text-yellow-900 border border-yellow-200 shadow-sm'
                            : 'bg-gray-100 text-gray-500 border border-gray-200'
                        }`}>
                          <Video size={13} className={videoCount > 0 ? 'text-yellow-600' : 'text-gray-400'} />
                          {videoCount} {videoCount === 1 ? 'Video' : 'Videos'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
                          user.isActive && !user.isBanned ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {user.isActive && !user.isBanned ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                          {user.isActive && !user.isBanned ? 'Active' : 'Suspended'}
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td className="px-6 py-4 text-sm font-medium text-gray-600">
                        {formatDate(user.createdAt)}
                      </td>
                    </tr>
                  );
                })
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
                className="px-3.5 py-1.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-white disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
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
                    className={`w-8 h-8 flex items-center justify-center rounded-xl text-sm font-bold transition-colors cursor-pointer ${
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
                className="px-3.5 py-1.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-white bg-white shadow-sm transition-colors cursor-pointer"
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