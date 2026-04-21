'use client';

import VideoCard from './VideoCard';

interface VideoGalleryProps {
  videos: any[];
  onRemove?: (id: string | number) => void; // Optional kar diya taake sirf view ke liye bhi use ho sakay
}

export default function VideoGallery({ videos, onRemove }: VideoGalleryProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video) => (
          <VideoCard 
            key={video.id} 
            video={video} 
            onRemove={onRemove || (() => {})} 
          />
        ))}
      </div>
      
      {videos.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
          <p className="text-gray-500 font-medium">No videos found.</p>
        </div>
      )}
    </div>
  );
}