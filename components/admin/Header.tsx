'use client';

import { useState, useEffect } from 'react';
import { PanelLeft } from 'lucide-react';
import { getLocalAdminUserAction } from '@/actions/auth';
import { usePathname } from 'next/navigation';

interface AdminHeaderProps {
  onToggleSidebar: () => void;  // callback to toggle sidebar collapse
}

export default function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const pathname = usePathname();
  const [adminUser, setAdminUser] = useState<{ username?: string; email?: string; profileImage?: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getLocalAdminUserAction();
      if (user) setAdminUser(user);
    };
    fetchUser();
  }, []);

  // Get page title from pathname
  const getPageTitle = () => {
    if (pathname === '/admin') return 'Dashboard';
    if (pathname === '/admin/users') return 'User Management';
    if (pathname === '/admin/videos') return 'Content Moderation';
    if (pathname.startsWith('/admin/users/')) return 'User Details';
    if (pathname.startsWith('/admin/videos/')) return 'Video Details';
    return 'Admin Panel';
  };

  const displayName = adminUser?.username || 'Admin';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-50 w-full">
      {/* Left section: hamburger + page title */}
    <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
          aria-label="Toggle sidebar"
        >
          {/* ✅ Modern Admin Sidebar Icon */}
          <PanelLeft size={22} /> 
        </button>
        <h1 className="text-xl font-black text-gray-900">{getPageTitle()}</h1>
      </div>

      {/* Right section: profile (unchanged) */}
      <div className="flex items-center gap-3 cursor-pointer group">
        <div className="text-right hidden md:block">
          <p className="text-sm font-bold text-gray-900 group-hover:text-yellow-600 transition-colors capitalize">
            {adminUser?.username || adminUser?.email?.split('@')[0] || 'User'}
          </p>
          {adminUser?.email && adminUser?.username !== adminUser?.email?.split('@')[0] && (
            <p className="text-xs font-medium text-gray-500">{adminUser.email}</p>
          )}
        </div>
        <div className="w-10 h-10 rounded-full bg-gray-900 text-yellow-500 flex items-center justify-center font-bold ring-2 ring-white shadow-sm overflow-hidden border border-gray-200">
          {adminUser?.profileImage && !adminUser.profileImage.includes('default.png') ? (
            <img src={adminUser.profileImage} alt={displayName} className="w-full h-full object-cover" />
          ) : (
            <span>{initial}</span>
          )}
        </div>
      </div>
    </header>
  );
}