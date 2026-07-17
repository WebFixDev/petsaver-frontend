'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  ShieldAlert, 
  CheckCircle2,
  Eye,
  Loader2,
  AlertTriangle,
  User,
  Clock,
  ExternalLink
} from 'lucide-react';
import { getReportsAction, updateReportStatusAction, getReportByIdAction, ReportItem } from '@/actions/report';

export default function UserReportsManagement() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<'pending' | 'reviewed' | 'resolved' | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  });

  // Modal State
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [reportDetail, setReportDetail] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getReportsAction({
        type: 'user',
        status: selectedStatus === 'all' ? undefined : selectedStatus,
        page: pagination.page,
        limit: pagination.limit
      });

      if (result.success && result.data) {
        setReports(result.data.reports);
        setPagination(prev => ({
          ...prev,
          total: result.data!.pagination.total,
          pages: result.data!.pagination.pages
        }));
      } else {
        console.error('Failed to fetch reports:', result.error);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, selectedStatus]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Open detail modal and fetch full info
  const handleOpenDetail = async (reportId: string) => {
    setSelectedReportId(reportId);
    setDetailLoading(true);
    try {
      const result = await getReportByIdAction(reportId);
      if (result.success && result.data) {
        setReportDetail(result.data.report);
      } else {
        alert(result.error || 'Failed to fetch report details');
        setSelectedReportId(null);
      }
    } catch (error) {
      console.error('Error fetching report details:', error);
      setSelectedReportId(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseDetail = () => {
    setSelectedReportId(null);
    setReportDetail(null);
  };

  // Perform moderation action
  const handleModerationAction = async (action: 'no_action' | 'warning' | 'banned') => {
    if (!reportDetail?._id) return;
    
    let confirmMsg = 'Are you sure you want to resolve this report?';
    if (action === 'banned') {
      confirmMsg = 'WARNING: Banning this user will prevent them from logging in and accessing their profile. Proceed?';
    }

    if (!confirm(confirmMsg)) return;

    setActionLoading(true);
    try {
      const result = await updateReportStatusAction(reportDetail._id, {
        status: 'resolved',
        actionTaken: action
      });

      if (result.success) {
        alert('Action applied successfully');
        handleCloseDetail();
        fetchReports();
      } else {
        alert(result.error || 'Failed to apply action');
      }
    } catch (error) {
      console.error('Moderation error:', error);
      alert('An error occurred while processing action.');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filtered reports locally by search query if any (e.g. search by reason or reporter name)
  const filteredReports = reports.filter(report => {
    const term = searchQuery.toLowerCase();
    if (!term) return true;
    return (
      report.reason?.toLowerCase().includes(term) ||
      report.description?.toLowerCase().includes(term) ||
      report.reporterId?.username?.toLowerCase().includes(term) ||
      report.reporterId?.fullName?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <ShieldAlert className="text-red-500" size={28} />
            User Reports
          </h1>
          <p className="text-sm font-medium text-gray-500 mt-1">
            Review and resolve reports filed against community users for policy violations.
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:max-w-md">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Search by reporter, reason, or description..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all text-sm font-medium"
          />
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value as any);
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 appearance-none min-w-[140px]"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Reported User (Target)</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Reporter</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-yellow-500 mx-auto" />
                    <p className="mt-2 text-gray-500 font-medium">Loading reports...</p>
                  </td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-medium">
                    No user reports found.
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr 
                    key={report._id} 
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      {/* We show reportedId since user details get fetched fully in details, 
                          but we can represent it cleanly */}
                      <span className="font-bold text-gray-900 font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                        {report.reportedId}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-900 text-yellow-500 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                          {report.reporterId?.avatar || report.reporterId?.profileImage ? (
                            <img 
                              src={report.reporterId.avatar || report.reporterId.profileImage} 
                              alt="" 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            report.reporterId?.username?.charAt(0).toUpperCase() || 'U'
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-sm">
                            {report.reporterId?.fullName || report.reporterId?.username || 'Unknown'}
                          </div>
                          {report.reporterId?.username && (
                            <div className="text-xs font-semibold text-gray-400">
                              @{report.reporterId.username}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-900">{report.reason}</div>
                      {report.description && (
                        <div className="text-xs text-gray-500 truncate max-w-[200px]" title={report.description}>
                          {report.description}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                        report.status === 'resolved' 
                          ? 'bg-green-100 text-green-700' 
                          : report.status === 'reviewed'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {report.status === 'resolved' ? (
                          <CheckCircle2 size={12} />
                        ) : report.status === 'reviewed' ? (
                          <Eye size={12} />
                        ) : (
                          <Clock size={12} />
                        )}
                        {report.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-gray-500">
                      {formatDate(report.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleOpenDetail(report._id)}
                        className="px-3.5 py-1.5 bg-yellow-50 text-yellow-600 hover:bg-yellow-100 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ml-auto"
                      >
                        <Eye size={14} /> Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {!loading && filteredReports.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
            <p className="text-sm font-medium text-gray-500">
              Showing <span className="font-bold text-gray-900">
                {(pagination.page - 1) * pagination.limit + 1}
              </span> to <span className="font-bold text-gray-900">
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </span> of <span className="font-bold text-gray-900">{pagination.total}</span> reports
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-1.5 border border-gray-200 text-gray-500 rounded-lg text-sm font-bold hover:bg-white disabled:opacity-50 transition-colors"
              >
                Previous
              </button>
              <span className="text-sm font-bold text-gray-700 px-2">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button 
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="px-3 py-1.5 border border-gray-200 text-gray-750 rounded-lg text-sm font-bold hover:bg-white bg-white shadow-sm transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Review Detail Modal */}
      {selectedReportId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-950 text-white">
              <div className="flex items-center gap-2">
                <ShieldAlert size={22} className="text-red-500" />
                <h3 className="text-lg font-black">Review User Report</h3>
              </div>
              <button 
                onClick={handleCloseDetail}
                className="text-gray-400 hover:text-white transition-colors text-sm font-bold"
              >
                ✕ Close
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-gray-700">
              {detailLoading ? (
                <div className="py-12 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-yellow-500 mx-auto" />
                  <p className="mt-2 text-gray-500">Loading report full details...</p>
                </div>
              ) : reportDetail ? (
                <>
                  {/* Status Banner */}
                  <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                    reportDetail.status === 'resolved' 
                      ? 'bg-green-50 border-green-200 text-green-800' 
                      : 'bg-yellow-50 border-yellow-200 text-yellow-800'
                  }`}>
                    <AlertTriangle size={20} className="shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-sm">
                        Status: {reportDetail.status.toUpperCase()}
                      </p>
                      {reportDetail.status === 'resolved' && (
                        <p className="text-xs font-semibold mt-1">
                          Action Taken: <span className="font-bold underline">{reportDetail.actionTaken || 'None'}</span>
                          {reportDetail.reviewedBy && ` by ${reportDetail.reviewedBy.fullName}`}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Report Details */}
                  <div className="space-y-3">
                    <h4 className="font-black text-gray-900 border-b pb-1 text-sm uppercase tracking-wider">Report details</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-xl">
                      <div>
                        <span className="block text-xs font-bold text-gray-400 uppercase">Reason</span>
                        <span className="font-bold text-gray-900">{reportDetail.reason}</span>
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-gray-400 uppercase">Date Reported</span>
                        <span className="font-medium text-gray-900">{formatDate(reportDetail.createdAt)}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="block text-xs font-bold text-gray-400 uppercase">Description / Comments</span>
                        <p className="font-medium text-gray-800 bg-white p-3 rounded-lg border border-gray-100 mt-1 whitespace-pre-wrap">
                          {reportDetail.description || 'No additional details provided by reporter.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Reporter details */}
                  <div className="space-y-3">
                    <h4 className="font-black text-gray-900 border-b pb-1 text-sm uppercase tracking-wider">Reporter information</h4>
                    <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
                      <div className="w-12 h-12 rounded-full bg-gray-950 text-yellow-500 flex items-center justify-center font-black overflow-hidden shadow-sm shrink-0">
                        {reportDetail.reporterId?.avatar || reportDetail.reporterId?.profileImage ? (
                          <img src={reportDetail.reporterId.avatar || reportDetail.reporterId.profileImage} alt="" className="w-full h-full object-cover" />
                        ) : (
                          reportDetail.reporterId?.username?.charAt(0).toUpperCase() || 'R'
                        )}
                      </div>
                      <div>
                        <h5 className="font-black text-gray-900">{reportDetail.reporterId?.fullName || reportDetail.reporterId?.username || 'Unknown'}</h5>
                        <p className="text-xs text-gray-500 font-medium">@{reportDetail.reporterId?.username} • {reportDetail.reporterId?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Reported User (Target) Info */}
                  <div className="space-y-3">
                    <h4 className="font-black text-gray-900 border-b pb-1 text-sm uppercase tracking-wider">Reported User Profile</h4>
                    {reportDetail.reportedItem ? (
                      <div className="border border-gray-200 rounded-xl p-4 space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-full bg-gray-950 text-yellow-500 flex items-center justify-center font-black overflow-hidden shadow-sm shrink-0">
                            {reportDetail.reportedItem.avatar || reportDetail.reportedItem.profileImage ? (
                              <img src={reportDetail.reportedItem.avatar || reportDetail.reportedItem.profileImage} alt="" className="w-full h-full object-cover" />
                            ) : (
                              reportDetail.reportedItem.username?.charAt(0).toUpperCase() || 'T'
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="font-black text-gray-900">{reportDetail.reportedItem.fullName || reportDetail.reportedItem.username}</h5>
                              {reportDetail.reportedItem.isBanned && (
                                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-black rounded uppercase">Banned</span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 font-medium">@{reportDetail.reportedItem.username} • {reportDetail.reportedItem.email}</p>
                          </div>
                        </div>

                        {reportDetail.reportedItem.bio && (
                          <p className="text-sm bg-gray-50 p-2.5 rounded-lg text-gray-600 italic">
                            &ldquo;{reportDetail.reportedItem.bio}&rdquo;
                          </p>
                        )}

                        <div className="grid grid-cols-3 gap-2 text-center bg-gray-50 py-2.5 rounded-lg">
                          <div>
                            <span className="block text-xs font-bold text-gray-400 uppercase">Videos</span>
                            <span className="font-black text-gray-900 text-sm">{reportDetail.reportedItem.stats?.videosCount || 0}</span>
                          </div>
                          <div>
                            <span className="block text-xs font-bold text-gray-400 uppercase">Followers</span>
                            <span className="font-black text-gray-900 text-sm">{reportDetail.reportedItem.stats?.followersCount || 0}</span>
                          </div>
                          <div>
                            <span className="block text-xs font-bold text-gray-400 uppercase">Account Status</span>
                            <span className={`text-xs font-bold uppercase ${reportDetail.reportedItem.isBanned ? 'text-red-650' : 'text-green-600'}`}>
                              {reportDetail.reportedItem.isBanned ? 'Suspended' : 'Active'}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <a 
                            href={`/admin/users/${reportDetail.reportedId}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-yellow-600 hover:text-yellow-700 flex items-center gap-1"
                          >
                            Go to User Admin Page <ExternalLink size={12} />
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl font-semibold border border-red-200">
                        This user account may have been permanently deleted or is inaccessible. (ID: {reportDetail.reportedId})
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-center text-gray-500">Report details unavailable.</p>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-3">
              <button 
                onClick={handleCloseDetail}
                disabled={actionLoading}
                className="px-4 py-2 bg-white border border-gray-250 text-gray-700 hover:bg-gray-100 rounded-xl font-bold text-sm transition-colors"
              >
                Close
              </button>

              {reportDetail && reportDetail.status !== 'resolved' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleModerationAction('no_action')}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-xl font-bold text-sm transition-colors"
                    title="Dismiss report and take no further actions"
                  >
                    No Action
                  </button>
                  <button
                    onClick={() => handleModerationAction('warning')}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-amber-500 text-white hover:bg-amber-600 rounded-xl font-bold text-sm transition-colors"
                    title="Send warning to user and resolve report"
                  >
                    Warn User
                  </button>
                  <button
                    onClick={() => handleModerationAction('banned')}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-red-600 text-white hover:bg-red-750 rounded-xl font-bold text-sm transition-colors flex items-center gap-1.5 shadow-md shadow-red-500/10"
                    title="Ban the reported user permanently"
                  >
                    Ban User
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
