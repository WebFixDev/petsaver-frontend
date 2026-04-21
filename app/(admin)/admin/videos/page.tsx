'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Loader2 } from 'lucide-react';
import VideoGallery from '@/components/admin/VideoGallery';
import { getAllVideosAction } from '@/actions/video';

interface Video {
  id: string;
  title: string;
  user: string;
  handle: string;
  likes: string | number;
  duration: string;
  status: string;
  date: string;
  privacy: 'public' | 'friends' | 'private';
  thumbnailUrl?: string;
}

export default function ContentPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalVideos, setTotalVideos] = useState(0);

  const limit = 12; // videos per page

  // Fetch videos from API
  const fetchVideos = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAllVideosAction({
        page,
        limit,
        search: searchQuery || undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      if (result.success && result.data) {
const formattedVideos = result.data.videos.map((video: any) => ({
  id: video._id,
  title: video.caption,
  user: video.userId?.fullName || video.userId?.username || 'Unknown',
  handle: `@${video.userId?.username || 'user'}`,
  likes: formatNumber(video.stats?.likes || 0),
  comments: formatNumber(video.stats?.comments || 0),   // ✅ added
  duration: formatDuration(video.duration),
  status: video.status === 'published' ? 'Active' : video.status,
  date: timeAgo(video.createdAt),
  privacy: video.privacy,
  thumbnailUrl: video.thumbnailUrl,
  videoUrl: video.videoUrl,     // ✅ added for playback
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
  }, [page, searchQuery]);

  // Initial fetch and when dependencies change
  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  // Handle search with debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (page !== 1) setPage(1);
      else fetchVideos();
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  // Remove video handler
  const handleRemoveVideo = async (id: string | number) => {
    if (confirm('Are you sure you want to remove this video from Mazito?')) {
      // Call deleteVideoAction (assuming you have it)
      try {
        const { deleteVideoAction } = await import('@/actions/video');
        const result = await deleteVideoAction(id.toString());
        if (result.success) {
          // Remove from local state or refetch current page
          setVideos(prev => prev.filter(v => v.id !== id));
          // Optionally refetch to update counts
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

  // Pagination handlers
  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900">Content Moderation</h1>
        <p className="text-sm font-medium text-gray-500 mt-1">Review videos and remove violating content.</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:max-w-md">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search videos by title or handle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all text-sm font-medium"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Total: {totalVideos} videos</span>
        </div>
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
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-3 py-1.5 text-sm font-medium">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-gray-50"
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