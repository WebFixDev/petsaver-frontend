'use client';

import { useState } from 'react';
import { 
  PlayCircle, Heart, MessageCircle, Trash2, 
  Globe, Lock, Users, X
} from 'lucide-react';

interface VideoProps {
  video: {
    id: string | number;
    title: string;
    thumbnailUrl?: string;
    user: string;
    handle: string;
    likes: string | number;
    comments: string | number;
    duration: string;
    privacy?: 'public' | 'private' | 'friends';
    date: string;
    videoUrl?: string; // add video URL for playback
  };
  onRemove: (id: string | number) => void;
}

export default function VideoCard({ video, onRemove }: VideoProps) {
  const [showModal, setShowModal] = useState(false);

  const privacyConfig = {
    public: { icon: Globe, label: 'Public', color: 'text-green-600' },
    private: { icon: Lock, label: 'Private', color: 'text-gray-500' },
    friends: { icon: Users, label: 'Friends', color: 'text-blue-500' },
  };
  const privacy = video.privacy || 'public';
  const PrivacyIcon = privacyConfig[privacy].icon;

  const handlePlay = () => {
    if (video.videoUrl) {
      setShowModal(true);
    } else {
      alert('Video URL not available');
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
        {/* Thumbnail Section */}
        <div 
          className="aspect-[4/3] bg-gray-100 relative flex items-center justify-center overflow-hidden cursor-pointer"
          onClick={handlePlay}
        >
          {video.thumbnailUrl ? (
            <img 
              src={video.thumbnailUrl} 
              alt={video.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-0 bg-gray-200 group-hover:bg-gray-300 transition-colors" />
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <PlayCircle size={48} className="text-white/90" />
          </div>
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs font-bold rounded-lg backdrop-blur-sm z-10">
            {video.duration}
          </div>
          <div className="absolute top-2 left-2 px-2 py-1 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-bold rounded-lg flex items-center gap-1 shadow-md z-10">
            <PrivacyIcon size={12} /> {privacyConfig[privacy].label}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-bold text-gray-900 leading-snug line-clamp-2 mb-3" title={video.title}>
            {video.title}
          </h3>

          {/* Uploader Info */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center text-[10px] font-bold text-yellow-500 shrink-0 uppercase">
              {video.user.charAt(0)}
            </div>
            <p className="text-xs font-medium text-gray-500 truncate">{video.handle}</p>
            <span className="text-gray-300 mx-1">•</span>
            <p className="text-xs text-gray-400 shrink-0">{video.date}</p>
          </div>

          {/* Stats & Delete Button */}
          <div className="mt-auto pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-4 text-gray-500">
                <span className="flex items-center gap-1.5 text-xs font-bold">
                  <Heart size={14} /> {video.likes}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-bold">
                  <MessageCircle size={14} /> {video.comments}
                </span>
              </div>
              <button 
                onClick={() => onRemove(video.id)}
                className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 border border-red-100 hover:border-red-200 rounded-lg text-sm font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Trash2 size={14} /> Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="relative w-full max-w-4xl mx-4 bg-black rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition"
            >
              <X size={24} />
            </button>
            <video 
              src={video.videoUrl} 
              controls 
              autoPlay
              className="w-full h-auto max-h-[80vh]"
              controlsList="nodownload"
            />
          </div>
        </div>
      )}
    </>
  );
}