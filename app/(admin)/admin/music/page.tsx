'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Music, Upload, Search, Trash2, Play, Pause, TrendingUp, 
  Plus, X, Loader2, Sparkles, Filter, CheckCircle2, AlertCircle,
  Volume2, VolumeX, Disc, Radio, Eye, RefreshCw
} from 'lucide-react';
import { 
  getSoundsAction, 
  uploadSoundAction, 
  deleteSoundAction, 
  toggleTrendingSoundAction, 
  SoundItem 
} from '@/actions/sound';

const CATEGORIES = [
  { id: 'all', label: 'All Sounds' },
  { id: 'music', label: 'Music' },
  { id: 'voice', label: 'Voice' },
  { id: 'effect', label: 'Effects' },
  { id: 'nature', label: 'Nature' },
  { id: 'animal', label: 'Animal' },
];

export default function MusicPage() {
  const [sounds, setSounds] = useState<SoundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [trendingOnly, setTrendingOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSounds, setTotalSounds] = useState(0);

  // Audio Playback State
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [playbackProgress, setPlaybackProgress] = useState<{ [id: string]: number }>({});
  const audioRefs = useRef<{ [id: string]: HTMLAudioElement }>({});

  // Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Upload Form Fields
  const [trackName, setTrackName] = useState('');
  const [artistName, setArtistName] = useState('');
  const [category, setCategory] = useState<'music' | 'voice' | 'effect' | 'nature' | 'animal'>('music');
  const [genre, setGenre] = useState('');
  const [tags, setTags] = useState('');
  const [isTrending, setIsTrending] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [previewAudioUrl, setPreviewAudioUrl] = useState<string | null>(null);

  // Delete confirmation modal state
  const [soundToDelete, setSoundToDelete] = useState<SoundItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch Sounds
  const fetchSounds = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getSoundsAction({
        page,
        limit: 10,
        search: searchQuery.trim() || undefined,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        isTrending: trendingOnly ? true : undefined,
      });

      if (res.success && res.data) {
        setSounds(res.data.sounds || []);
        setTotalPages(res.data.pagination.pages || 1);
        setTotalSounds(res.data.pagination.total || 0);
      } else {
        setSounds([]);
      }
    } catch (err) {
      console.error('Failed to fetch sounds:', err);
      setSounds([]);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, selectedCategory, trendingOnly]);

  useEffect(() => {
    fetchSounds();
  }, [fetchSounds]);

  // Audio Player Handlers
  const togglePlayAudio = (sound: SoundItem) => {
    const currentAudio = audioRefs.current[sound._id];

    if (playingId === sound._id) {
      if (currentAudio) {
        currentAudio.pause();
      }
      setPlayingId(null);
    } else {
      // Pause any previously playing audio
      if (playingId && audioRefs.current[playingId]) {
        audioRefs.current[playingId].pause();
      }

      if (currentAudio) {
        currentAudio.play().catch(e => console.warn('Audio play error:', e));
        setPlayingId(sound._id);
      }
    }
  };

  const handleAudioEnded = (soundId: string) => {
    setPlayingId(null);
    setPlaybackProgress(prev => ({ ...prev, [soundId]: 0 }));
  };

  const handleTimeUpdate = (soundId: string) => {
    const audio = audioRefs.current[soundId];
    if (audio && audio.duration) {
      const progress = (audio.currentTime / audio.duration) * 100;
      setPlaybackProgress(prev => ({ ...prev, [soundId]: progress }));
    }
  };

  // Thumbnail selection handler
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const url = URL.createObjectURL(file);
      setThumbnailPreview(url);
    }
  };

  // Audio file selection handler (Max 3MB)
  const MAX_AUDIO_SIZE_MB = 3;
  const MAX_AUDIO_SIZE_BYTES = MAX_AUDIO_SIZE_MB * 1024 * 1024;

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_AUDIO_SIZE_BYTES) {
        const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
        setUploadError(`Audio file too large (${sizeMb} MB). Maximum allowed size is ${MAX_AUDIO_SIZE_MB} MB.`);
        setAudioFile(null);
        setPreviewAudioUrl(null);
        e.target.value = '';
        return;
      }

      setUploadError(null);
      setAudioFile(file);
      const url = URL.createObjectURL(file);
      setPreviewAudioUrl(url);

      // Auto-populate track title from filename if empty
      if (!trackName) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setTrackName(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
    }
  };

  // Reset Upload Form
  const resetUploadForm = () => {
    setTrackName('');
    setArtistName('');
    setCategory('music');
    setGenre('');
    setTags('');
    setIsTrending(false);
    setAudioFile(null);
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setPreviewAudioUrl(null);
    setUploadError(null);
    setUploadSuccess(false);
  };

  // Handle Form Submit
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioFile) {
      setUploadError('Please select an audio file (MP3, WAV, AAC, M4A)');
      return;
    }
    if (audioFile.size > MAX_AUDIO_SIZE_BYTES) {
      setUploadError(`Audio file exceeds ${MAX_AUDIO_SIZE_MB} MB limit.`);
      return;
    }
    if (!trackName.trim()) {
      setUploadError('Track name is required');
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('audio', audioFile);
      if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile);
      }
      formData.append('name', trackName.trim());
      formData.append('artist', artistName.trim() || 'Mazito Music');
      formData.append('category', category);
      if (genre.trim()) formData.append('genre', genre.trim());
      if (tags.trim()) formData.append('tags', tags.trim());
      formData.append('isTrending', String(isTrending));

      const res = await uploadSoundAction(formData);

      if (res.success) {
        setUploadSuccess(true);
        setTimeout(() => {
          setIsUploadModalOpen(false);
          resetUploadForm();
          fetchSounds();
        }, 1200);
      } else {
        setUploadError(res.error || res.message || 'Failed to upload sound');
      }
    } catch (err: any) {
      setUploadError(err?.message || 'Something went wrong during upload');
    } finally {
      setUploading(false);
    }
  };

  // Toggle Trending Handler
  const handleToggleTrending = async (soundId: string) => {
    try {
      const res = await toggleTrendingSoundAction(soundId);
      if (res.success && res.data) {
        setSounds(prev => prev.map(s => s._id === soundId ? { ...s, isTrending: res.data!.isTrending } : s));
      }
    } catch (err) {
      console.error('Error toggling trending:', err);
    }
  };

  // Delete Sound Handler
  const handleDeleteConfirm = async () => {
    if (!soundToDelete) return;
    setDeleting(true);
    try {
      const res = await deleteSoundAction(soundToDelete._id);
      if (res.success) {
        setSounds(prev => prev.filter(s => s._id !== soundToDelete._id));
        setTotalSounds(prev => Math.max(0, prev - 1));
        setSoundToDelete(null);
      } else {
        alert(res.error || 'Failed to delete sound');
      }
    } catch (err) {
      console.error('Delete sound error:', err);
    } finally {
      setDeleting(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-yellow-500 to-amber-400 flex items-center justify-center text-gray-950 shadow-md shadow-yellow-500/20">
            <Music size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Music & Sounds Library</h1>
            <p className="text-sm text-gray-500">Manage, preview and upload background audio & sound effects</p>
          </div>
        </div>

        <button
          onClick={() => {
            resetUploadForm();
            setIsUploadModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-yellow-500 hover:bg-yellow-400 text-gray-950 font-bold rounded-xl transition-all shadow-md shadow-yellow-500/20 active:scale-95"
        >
          <Plus size={20} />
          <span>Upload Music</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Sounds</p>
            <p className="text-2xl font-black text-gray-900 mt-1">{totalSounds}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center">
            <Disc size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Music Tracks</p>
            <p className="text-2xl font-black text-gray-900 mt-1">
              {sounds.filter(s => s.category === 'music').length}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Music size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sound Effects</p>
            <p className="text-2xl font-black text-gray-900 mt-1">
              {sounds.filter(s => s.category === 'effect' || s.category === 'voice').length}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Radio size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Trending</p>
            <p className="text-2xl font-black text-gray-900 mt-1">
              {sounds.filter(s => s.isTrending).length}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <TrendingUp size={20} />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by title, artist, or tags..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:bg-white transition-all text-gray-800"
            />
          </div>

          {/* Trending Filter Toggle & Refresh */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button
              onClick={() => {
                setTrendingOnly(!trendingOnly);
                setPage(1);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all border ${
                trendingOnly 
                  ? 'bg-amber-50 border-amber-300 text-amber-700' 
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <TrendingUp size={16} />
              <span>Trending Only</span>
            </button>

            <button
              onClick={fetchSounds}
              className="p-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-gray-600 transition-colors"
              title="Refresh"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-yellow-500 text-gray-950 shadow-sm shadow-yellow-500/20'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sounds List / Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="animate-spin mb-3 text-yellow-500" size={32} />
            <p className="text-sm font-medium">Loading sounds library...</p>
          </div>
        ) : sounds.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600 mb-4">
              <Music size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No sounds found</h3>
            <p className="text-sm text-gray-500 max-w-sm mt-1 mb-6">
              {searchQuery ? `No results matching "${searchQuery}"` : 'Your audio library is empty. Upload your first music track or sound effect.'}
            </p>
            <button
              onClick={() => {
                resetUploadForm();
                setIsUploadModalOpen(true);
              }}
              className="px-4 py-2.5 bg-yellow-500 text-gray-950 font-bold rounded-xl text-sm shadow hover:bg-yellow-400 transition-all flex items-center gap-2"
            >
              <Plus size={16} />
              <span>Upload Sound</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {sounds.map((sound) => {
              const isPlaying = playingId === sound._id;
              const progress = playbackProgress[sound._id] || 0;

              return (
                <div 
                  key={sound._id}
                  className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/70 transition-colors"
                >
                  {/* Hidden Audio Element */}
                  <audio
                    ref={(el) => {
                      if (el) audioRefs.current[sound._id] = el;
                    }}
                    src={sound.audioUrl}
                    onEnded={() => handleAudioEnded(sound._id)}
                    onTimeUpdate={() => handleTimeUpdate(sound._id)}
                    preload="metadata"
                  />

                  {/* Left: Thumbnail & Track Info */}
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Play/Pause Artwork Button */}
                    <div className="relative group shrink-0">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-900 relative shadow-sm border border-gray-200 flex items-center justify-center">
                        {sound.thumbnail ? (
                          <img 
                            src={sound.thumbnail} 
                            alt={sound.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-950 flex items-center justify-center text-yellow-400">
                            <Music size={22} />
                          </div>
                        )}

                        {/* Play/Pause Overlay */}
                        <button
                          onClick={() => togglePlayAudio(sound)}
                          className={`absolute inset-0 flex items-center justify-center transition-all ${
                            isPlaying 
                              ? 'bg-black/50 text-yellow-400 opacity-100' 
                              : 'bg-black/40 text-white opacity-0 group-hover:opacity-100'
                          }`}
                          aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
                        >
                          {isPlaying ? <Pause size={22} className="fill-current" /> : <Play size={22} className="fill-current ml-0.5" />}
                        </button>
                      </div>

                      {/* Equalizer animation when playing */}
                      {isPlaying && (
                        <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                        </span>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-900 truncate text-base">{sound.name}</h4>
                        {sound.isTrending && (
                          <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-800 flex items-center gap-1">
                            <TrendingUp size={10} />
                            Trending
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 font-medium truncate mt-0.5">
                        {sound.artist || 'Unknown Artist'} {sound.genre ? `• ${sound.genre}` : ''}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-gray-100 text-gray-600 capitalize">
                          {sound.category}
                        </span>
                        <span className="text-[11px] text-gray-400 font-medium">
                          Duration: {formatDuration(sound.duration)}
                        </span>
                        {sound.usesCount > 0 && (
                          <span className="text-[11px] text-gray-400 font-medium">
                            • {sound.usesCount} uses
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Middle / Right: Audio Progress Bar & Actions */}
                  <div className="flex items-center gap-3 shrink-0 self-end md:self-center w-full md:w-auto justify-between md:justify-end">
                    {/* Audio Scrub Bar */}
                    <div className="flex items-center gap-3 w-40 sm:w-56">
                      <button
                        onClick={() => togglePlayAudio(sound)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shrink-0 ${
                          isPlaying 
                            ? 'bg-yellow-500 text-gray-950 shadow-sm' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {isPlaying ? <Pause size={16} className="fill-current" /> : <Play size={16} className="fill-current ml-0.5" />}
                      </button>

                      <div className="flex-1 bg-gray-200 h-1.5 rounded-full overflow-hidden relative">
                        <div 
                          className="bg-yellow-500 h-full rounded-full transition-all duration-150"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Trending Toggle Button */}
                    <button
                      onClick={() => handleToggleTrending(sound._id)}
                      className={`p-2 rounded-xl transition-colors border ${
                        sound.isTrending
                          ? 'bg-amber-50 border-amber-300 text-amber-600'
                          : 'bg-gray-50 border-gray-200 text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                      title={sound.isTrending ? 'Remove from Trending' : 'Mark as Trending'}
                    >
                      <TrendingUp size={16} />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => setSoundToDelete(sound)}
                      className="p-2 rounded-xl bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-600 border border-gray-200 hover:border-red-200 transition-colors"
                      title="Delete Track"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-600 bg-gray-50/50">
            <p>Showing page {page} of {totalPages}</p>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Upload Music Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-100 text-yellow-700 flex items-center justify-center">
                  <Upload size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Upload New Track</h3>
                  <p className="text-xs text-gray-500">Audio will be saved to AWS S3 & sound library</p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Error / Success Banners */}
            {uploadError && (
              <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {uploadSuccess && (
              <div className="p-3 mb-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs flex items-center gap-2">
                <CheckCircle2 size={16} className="shrink-0" />
                <span>Track uploaded successfully! Updating library...</span>
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* Audio File Picker */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Audio File *
                </label>
                <div className="border-2 border-dashed border-gray-200 hover:border-yellow-400 rounded-2xl p-4 text-center cursor-pointer transition-colors relative bg-gray-50 hover:bg-yellow-50/20">
                  <input
                    type="file"
                    accept="audio/mp3,audio/mpeg,audio/wav,audio/aac,audio/m4a,audio/ogg"
                    onChange={handleAudioChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    required
                  />
                  <div className="flex flex-col items-center">
                    <Music className="text-yellow-600 mb-2" size={28} />
                    <p className="text-sm font-bold text-gray-800">
                      {audioFile ? audioFile.name : 'Choose Audio File'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {audioFile 
                        ? `${(audioFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload` 
                        : 'MP3, WAV, AAC, M4A up to 3MB'}
                    </p>
                  </div>
                </div>

                {/* Audio Preview if selected */}
                {previewAudioUrl && (
                  <div className="mt-2 p-2 bg-yellow-50 rounded-xl border border-yellow-200">
                    <audio controls className="w-full h-8" src={previewAudioUrl} />
                  </div>
                )}
              </div>

              {/* Cover / Thumbnail Picker */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Cover Art (Optional)
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                    {thumbnailPreview ? (
                      <img src={thumbnailPreview} alt="Cover preview" className="w-full h-full object-cover" />
                    ) : (
                      <Music size={22} className="text-gray-400" />
                    )}
                  </div>
                  <label className="cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors">
                    <span>{thumbnailFile ? 'Change Cover' : 'Upload Cover'}</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleThumbnailChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Track Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Track Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Playful Puppy Beat"
                  value={trackName}
                  onChange={(e) => setTrackName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:bg-white text-gray-900"
                />
              </div>

              {/* Artist Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Artist / Creator
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mazito Records, Pet Beatmaker"
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:bg-white text-gray-900"
                />
              </div>

              {/* Category & Genre */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:bg-white text-gray-900"
                  >
                    <option value="music">Music</option>
                    <option value="voice">Voice</option>
                    <option value="effect">Effect</option>
                    <option value="nature">Nature</option>
                    <option value="animal">Animal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Genre / Mood
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Acoustic, Lo-Fi"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:bg-white text-gray-900"
                  >
                  </input>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="dogs, energetic, happy, cute"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:bg-white text-gray-900"
                />
              </div>

              {/* Trending Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="trendingCheck"
                  checked={isTrending}
                  onChange={(e) => setIsTrending(e.target.checked)}
                  className="w-4 h-4 text-yellow-500 rounded border-gray-300 focus:ring-yellow-500"
                />
                <label htmlFor="trendingCheck" className="text-sm font-semibold text-gray-700 cursor-pointer">
                  Feature in Trending Sounds list
                </label>
              </div>

              {/* Actions */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  disabled={uploading}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || !audioFile}
                  className="px-6 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-gray-950 font-bold text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-yellow-500/20"
                >
                  {uploading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Uploading to S3...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={16} />
                      <span>Upload Track</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {soundToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={26} />
            </div>
            <h3 className="font-bold text-lg text-gray-900">Delete Sound Track?</h3>
            <p className="text-sm text-gray-500 mt-1 mb-6">
              Are you sure you want to delete <span className="font-semibold text-gray-800">"{soundToDelete.name}"</span>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setSoundToDelete(null)}
                disabled={deleting}
                className="w-1/2 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="w-1/2 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {deleting ? <Loader2 size={16} className="animate-spin" /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
