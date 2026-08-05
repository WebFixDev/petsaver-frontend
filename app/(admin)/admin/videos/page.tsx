'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Search, Loader2, Calendar, Heart, Eye, MessageCircle, 
  RefreshCw, X, SlidersHorizontal, ArrowUpDown
} from 'lucide-react';
import VideoGallery from '@/components/admin/VideoGallery';
import CustomDateRangePicker from '@/components/admin/CustomDateRangePicker';
import CustomSortDropdown, { SortOptionValue } from '@/components/admin/CustomSortDropdown';
import CustomPrivacyDropdown, { PrivacyValue } from '@/components/admin/CustomPrivacyDropdown';
import { getAllVideosAction } from '@/actions/video';

interface Video {
  id: string;
  title: string;
  user: string;
  handle: string;
  likes: string | number;
  views: string | number;
  comments: string | number;
  duration: string;
  status: string;
  date: string;
  privacy: 'public' | 'friends' | 'private';
  thumbnailUrl?: string;
  videoUrl?: string;
}

export default function ContentPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalVideos, setTotalVideos] = useState(0);

  // 🟢 Advanced Filter States (Pure Lucide Component Based)
  const [sortValue, setSortValue] = useState<SortOptionValue>('createdAt:desc');
  const [datePreset, setDatePreset] = useState<'all' | 'today' | '7days' | '30days' | 'custom'>('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [minLikes, setMinLikes] = useState<string>('');
  const [minViews, setMinViews] = useState<string>('');
  const [minComments, setMinComments] = useState<string>('');
  const [privacy, setPrivacy] = useState<PrivacyValue>('all');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const limit = 12;

  // Split sort value into field and order
  const [sortBy, sortOrder] = sortValue.split(':') as ['createdAt' | 'likes' | 'views' | 'comments', 'desc' | 'asc'];

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

  // Fetch videos from API with advanced filters
  const fetchVideos = useCallback(async () => {
    setLoading(true);
    try {
      const { calcFrom, calcTo } = getCalculatedDates();

      const result = await getAllVideosAction({
        page,
        limit,
        search: searchQuery || undefined,
        sortBy,
        sortOrder,
        fromDate: calcFrom || undefined,
        toDate: calcTo || undefined,
        minLikes: minLikes ? Number(minLikes) : undefined,
        minViews: minViews ? Number(minViews) : undefined,
        minComments: minComments ? Number(minComments) : undefined,
        privacy: privacy !== 'all' ? privacy : undefined,
      });

      if (result.success && result.data) {
        const formattedVideos = result.data.videos.map((video: any) => ({
          id: video._id,
          title: video.caption || 'Untitled Video',
          user: video.userId?.fullName || video.userId?.username || 'Unknown',
          handle: `@${video.userId?.username || 'user'}`,
          likes: formatNumber(video.stats?.likes || 0),
          views: formatNumber(video.stats?.views || 0),
          comments: formatNumber(video.stats?.comments || 0),
          duration: formatDuration(video.duration || 0),
          status: video.status === 'published' ? 'Active' : video.status,
          date: timeAgo(video.createdAt),
          privacy: video.privacy,
          thumbnailUrl: video.thumbnailUrl,
          videoUrl: video.videoUrl,
        }));
        setVideos(formattedVideos);
        setTotalPages(result.data.pagination.pages);
        setTotalVideos(result.data.pagination.total);
      } else {
        console.error('Failed to fetch videos:', result.error);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [
    page, searchQuery, sortBy, sortOrder, 
    datePreset, fromDate, toDate, 
    minLikes, minViews, minComments, privacy, getCalculatedDates
  ]);

  // Initial fetch and when dependencies change
  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  // Handle search & filter debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (page !== 1) setPage(1);
      else fetchVideos();
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchQuery, sortValue, datePreset, fromDate, toDate, minLikes, minViews, minComments, privacy]);

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSortValue('createdAt:desc');
    setDatePreset('all');
    setFromDate('');
    setToDate('');
    setMinLikes('');
    setMinViews('');
    setMinComments('');
    setPrivacy('all');
    setPage(1);
  };

  // Remove video handler
  const handleRemoveVideo = async (id: string | number) => {
    if (confirm('Are you sure you want to remove this video from PetSaver?')) {
      try {
        const { deleteVideoAction } = await import('@/actions/video');
        const result = await deleteVideoAction(id.toString());
        if (result.success) {
          setVideos(prev => prev.filter(v => v.id !== id));
          fetchVideos();
        } else {
          alert(result.error || 'Failed to delete video');
        }
      } catch (error) {
        console.error('Delete error:', error);
        alert('Error deleting video');
      }
    }
  };

  // Helper functions
  const formatNumber = (num: number): string => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const timeAgo = (date: string): string => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return past.toLocaleDateString();
  };

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Active filters count for badge
  const activeFiltersCount = 
    (sortValue !== 'createdAt:desc' ? 1 : 0) +
    (datePreset !== 'all' ? 1 : 0) +
    (minLikes ? 1 : 0) +
    (minViews ? 1 : 0) +
    (minComments ? 1 : 0) +
    (privacy !== 'all' ? 1 : 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Content Moderation & Analytics</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">Review and filter videos by Likes, Views, Comments, and Date range.</p>
        </div>
        <button
          onClick={() => fetchVideos()}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition shadow-sm cursor-pointer"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin text-yellow-600' : 'text-gray-500'} />
          Refresh
        </button>
      </div>

      {/* Main Search & Custom Sort Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search videos by caption, handle or hashtags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all text-sm font-medium"
            />
          </div>

          {/* Custom Lucide Sort Dropdown */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <div className="w-48 sm:w-52">
              <CustomSortDropdown
                value={sortValue}
                onChange={(val) => setSortValue(val)}
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              type="button"
              onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold transition-all shadow-sm cursor-pointer ${
                isFilterPanelOpen || activeFiltersCount > 0
                  ? 'bg-yellow-500 text-gray-900 border-yellow-500 shadow-yellow-500/20'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <SlidersHorizontal size={16} />
              Advanced Filters
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-gray-900 text-yellow-400 text-xs font-black flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* 🟢 Expandable Advanced Filter Drawer with Custom Calendar */}
        {isFilterPanelOpen && (
          <div className="pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* 1. Custom Calendar Date Range Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
                <Calendar size={14} className="text-yellow-600" /> Date Range Calendar
              </label>
              <CustomDateRangePicker
                datePreset={datePreset}
                fromDate={fromDate}
                toDate={toDate}
                onChange={(preset, from, to) => {
                  setDatePreset(preset);
                  setFromDate(from);
                  setToDate(to);
                }}
              />
            </div>

            {/* 2. Min Likes Threshold */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
                <Heart size={14} className="text-rose-500" /> Minimum Likes
              </label>
              <input
                type="number"
                placeholder="e.g. 100"
                value={minLikes}
                onChange={(e) => setMinLikes(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-yellow-500/50"
              />
            </div>

            {/* 3. Min Views Threshold */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
                <Eye size={14} className="text-blue-500" /> Minimum Views
              </label>
              <input
                type="number"
                placeholder="e.g. 500"
                value={minViews}
                onChange={(e) => setMinViews(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-yellow-500/50"
              />
            </div>

            {/* 4. Min Comments Threshold */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
                <MessageCircle size={14} className="text-amber-500" /> Minimum Comments
              </label>
              <input
                type="number"
                placeholder="e.g. 20"
                value={minComments}
                onChange={(e) => setMinComments(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-yellow-500/50"
              />
            </div>

            {/* 5. Custom Privacy Dropdown */}
            <div className="space-y-1.5 col-span-1">
              <label className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
                Privacy Filter
              </label>
              <CustomPrivacyDropdown
                value={privacy}
                onChange={(val) => setPrivacy(val)}
              />
            </div>
          </div>
        )}

        {/* 🟢 Active Filter Badges with Lucide Icons */}
        {activeFiltersCount > 0 && (
          <div className="pt-3 border-t border-gray-100 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-gray-400">Active Filters:</span>

            {sortValue !== 'createdAt:desc' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-50 text-yellow-900 border border-yellow-200 rounded-lg text-xs font-bold">
                <ArrowUpDown size={12} className="text-yellow-600" />
                Sort: {sortBy} ({sortOrder})
                <X size={13} className="cursor-pointer hover:text-red-600 transition" onClick={() => setSortValue('createdAt:desc')} />
              </span>
            )}

            {datePreset !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg text-xs font-bold">
                <Calendar size={12} className="text-blue-600" />
                Date: {datePreset}
                <X size={13} className="cursor-pointer hover:text-red-600 transition" onClick={() => { setDatePreset('all'); setFromDate(''); setToDate(''); }} />
              </span>
            )}

            {minLikes && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-900 border border-rose-200 rounded-lg text-xs font-bold">
                <Heart size={12} className="text-rose-600" />
                Likes &ge; {minLikes}
                <X size={13} className="cursor-pointer hover:text-red-600 transition" onClick={() => setMinLikes('')} />
              </span>
            )}

            {minViews && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-900 border border-indigo-200 rounded-lg text-xs font-bold">
                <Eye size={12} className="text-indigo-600" />
                Views &ge; {minViews}
                <X size={13} className="cursor-pointer hover:text-red-600 transition" onClick={() => setMinViews('')} />
              </span>
            )}

            {minComments && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-xs font-bold">
                <MessageCircle size={12} className="text-amber-600" />
                Comments &ge; {minComments}
                <X size={13} className="cursor-pointer hover:text-red-600 transition" onClick={() => setMinComments('')} />
              </span>
            )}

            {privacy !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-900 border border-green-200 rounded-lg text-xs font-bold">
                Privacy: {privacy}
                <X size={13} className="cursor-pointer hover:text-red-600 transition" onClick={() => setPrivacy('all')} />
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

      {/* Results Count Summary */}
      <div className="flex items-center justify-between text-sm text-gray-500 px-1 font-medium">
        <span>Showing {videos.length} of {totalVideos} videos</span>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
        </div>
      ) : (
        <>
          {/* Video Gallery */}
          <VideoGallery videos={videos} onRemove={handleRemoveVideo} />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                className="px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 disabled:opacity-50 hover:bg-gray-50 shadow-sm transition cursor-pointer"
              >
                Previous
              </button>
              <span className="px-3.5 py-2 bg-white border border-gray-100 rounded-xl text-sm font-bold text-gray-800 shadow-sm">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
                className="px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 disabled:opacity-50 hover:bg-gray-50 shadow-sm transition cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}