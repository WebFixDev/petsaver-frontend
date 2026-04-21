'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, User, MapPin, Phone, Mail, Calendar, 
  Video, Users, Activity, Ban, Mail as MailIcon,
  PlayCircle, Clock, AlertTriangle, Eye, Loader2
} from 'lucide-react';
import { getUserByIdAction } from '@/actions/user';
import { getUserVideosAction, deleteVideoAction } from '@/actions/video';
import VideoGallery from '@/components/admin/VideoGallery';

export default function UserDetail() {
  const params = useParams();
  const userId = params.id as string;

  const [activeTab, setActiveTab] = useState('overview');
  const [userData, setUserData] = useState<any>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState<string | null>(null);

  // Video states
  const [videos, setVideos] = useState<any[]>([]);
  const [videosLoading, setVideosLoading] = useState(false);
  const [videosError, setVideosError] = useState<string | null>(null);
  const [videoPage, setVideoPage] = useState(1);
  const [videoTotalPages, setVideoTotalPages] = useState(1);
  const [videoTotal, setVideoTotal] = useState(0);

  const limit = 12;

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId) return;
      try {
        setUserLoading(true);
        const response = await getUserByIdAction(userId);
        if (response.success) {
          setUserData(response.data.user);
        } else {
          setUserError(response.error || 'Failed to fetch user data');
        }
      } catch (err) {
        setUserError('Something went wrong while fetching data.');
      } finally {
        setUserLoading(false);
      }
    };
    fetchUserDetails();
  }, [userId]);

  // Fetch user videos (only when needed, e.g., activeTab === 'videos' or always)
  const fetchUserVideos = useCallback(async (page = 1) => {
    if (!userId) return;
    try {
      setVideosLoading(true);
      setVideosError(null);
      const result = await getUserVideosAction(userId, {
        page,
        limit,
        type: 'all', // 'all' for uploaded videos
      });
      if (result.success && result.data) {
        // Transform videos to match VideoCard props
        const formatted = result.data.videos.map((video: any) => ({
          id: video._id,
          title: video.caption,
          thumbnailUrl: video.thumbnailUrl,
          videoUrl: video.videoUrl,
          user: video.userId?.fullName || video.userId?.username || 'Unknown',
          handle: `@${video.userId?.username || 'user'}`,
          likes: formatNumber(video.stats?.likes || 0),
          comments: formatNumber(video.stats?.comments || 0),
          duration: formatDuration(video.duration),
          privacy: video.privacy,
          date: timeAgo(video.createdAt),
        }));
        setVideos(formatted);
        setVideoTotalPages(result.data.pagination.pages);
        setVideoTotal(result.data.pagination.total);
      } else {
        setVideosError(result.error || 'Failed to load videos');
      }
    } catch (err) {
      setVideosError('Error fetching videos');
    } finally {
      setVideosLoading(false);
    }
  }, [userId, limit]);

  // Fetch videos when tab changes to 'videos' OR on first load if you want preload
  useEffect(() => {
    if (activeTab === 'videos') {
      fetchUserVideos(videoPage);
    }
  }, [activeTab, videoPage, fetchUserVideos]);

  // Handle video removal
  const handleRemoveVideo = async (videoId: string | number) => {
    if (!confirm('Are you sure you want to remove this video permanently?')) return;
    try {
      const result = await deleteVideoAction(videoId.toString());
      if (result.success) {
        // Refetch current page
        await fetchUserVideos(videoPage);
      } else {
        alert(result.error || 'Failed to delete video');
      }
    } catch (err) {
      alert('Error deleting video');
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

  const getInitials = (name: string) => {
    return name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not Provided';
    return new Date(dateString).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (userLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-yellow-500 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading user details...</p>
      </div>
    );
  }

  if (userError || !userData) {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 flex flex-col items-center">
        <AlertTriangle className="w-10 h-10 mb-2" />
        <p className="font-bold">{userError || 'User not found'}</p>
        <Link href="/admin/users" className="mt-4 px-4 py-2 bg-white text-gray-700 rounded-lg shadow-sm border font-medium">
          Go Back
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/users" className="p-2 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-gray-900">User Profile</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">Detailed view and management for this account.</p>
        </div>
      </div>

      {/* Hero Card */}
      <div className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-3xl bg-gray-900 text-yellow-500 flex items-center justify-center font-black text-3xl shadow-lg overflow-hidden">
            {userData.profileImage ? (
              <img src={userData.profileImage} alt={userData.fullName} className="w-full h-full object-cover" />
            ) : (
              getInitials(userData.fullName || userData.username)
            )}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-black text-gray-900">{userData.fullName || userData.username}</h2>
              <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold uppercase">{userData.role || 'User'}</span>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase ${userData.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                {userData.isActive ? 'Active' : 'Inactive'}
              </span>
              {userData.isBanned && (
                <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-bold uppercase">Banned</span>
              )}
            </div>
            <p className="text-gray-500 font-medium mb-3">@{userData.username}</p>
            <div className="flex gap-6 text-sm">
              <div><span className="font-bold text-gray-900">{userData.stats?.videosCount || 0}</span> <span className="text-gray-500">Videos</span></div>
              <div><span className="font-bold text-gray-900">{userData.stats?.followersCount || 0}</span> <span className="text-gray-500">Followers</span></div>
              <div><span className="font-bold text-gray-900">{userData.stats?.totalLikes || 0}</span> <span className="text-gray-500">Likes</span></div>
            </div>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <a href={`mailto:${userData.email}`} className="flex-1 md:flex-none px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
            <Mail size={18} /> Email User
          </a>
          <button className="flex-1 md:flex-none px-4 py-2.5 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
            <Ban size={18} /> {userData.isBanned ? 'Unban User' : 'Suspend'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto pb-px">
        {[
          { id: 'overview', label: 'Overview & Info', icon: User },
          { id: 'videos', label: 'Videos', icon: Video },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
                isActive 
                  ? 'border-yellow-500 text-gray-900 bg-yellow-50/50' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-yellow-600' : 'text-gray-400'} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-sm border border-gray-100 min-h-[400px]">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                <User size={20} className="text-yellow-500" /> Personal Information
              </h3>
              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 shrink-0"><Mail size={18} /></div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</p>
                    <p className="font-medium text-gray-900 flex items-center gap-2">
                      {userData.email || 'N/A'} 
                      {userData.isEmailVerified && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-md font-bold">Verified</span>}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 shrink-0"><Phone size={18} /></div>
                  <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone Number</p><p className="font-medium text-gray-900">{userData.phone || 'Not Provided'}</p></div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 shrink-0"><MapPin size={18} /></div>
                  <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Location / Bio</p><p className="font-medium text-gray-900">{userData.bio || 'Not Provided'}</p></div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 shrink-0"><Calendar size={18} /></div>
                  <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Date of Birth</p><p className="font-medium text-gray-900">{formatDate(userData.dateOfBirth)}</p></div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 h-fit">
              <h3 className="text-lg font-black text-gray-900 mb-4">Account Note (System)</h3>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                {userData.bannedReason ? (
                  <span className="text-red-600 font-medium">Banned Reason: {userData.bannedReason}</span>
                ) : (
                  "This user is operating normally. No active restrictions or flags on this account."
                )}
              </p>
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs font-bold text-gray-400 uppercase">Account Created</p>
                <p className="font-medium text-gray-900">{formatDate(userData.createdAt)}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'videos' && (
          <div>
            {videosLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
              </div>
            ) : videosError ? (
              <div className="text-center py-12 text-red-500">
                <p>{videosError}</p>
              </div>
            ) : (
              <>
                <VideoGallery videos={videos} onRemove={handleRemoveVideo} />
                {videoTotalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-6">
                    <button
                      onClick={() => setVideoPage(p => Math.max(1, p - 1))}
                      disabled={videoPage === 1}
                      className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-1.5 text-sm font-medium">
                      Page {videoPage} of {videoTotalPages}
                    </span>
                    <button
                      onClick={() => setVideoPage(p => Math.min(videoTotalPages, p + 1))}
                      disabled={videoPage === videoTotalPages}
                      className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                )}
                {videos.length === 0 && !videosLoading && (
                  <div className="text-center py-12 text-gray-500">
                    <Video className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No videos uploaded by this user.</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}