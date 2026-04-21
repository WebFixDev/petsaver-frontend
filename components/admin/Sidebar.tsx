'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Video, 
  LogOut,
  PawPrint
} from 'lucide-react';
import { getLocalAdminUserAction, logoutAdminAction } from '@/actions/auth';


interface AdminSidebarProps {
  collapsed: boolean;
}

export default function AdminSidebar({ collapsed }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<{ username?: string; email?: string; profileImage?: string } | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getLocalAdminUserAction();
      if (user) setAdminUser(user);
    };
    fetchUser();
  }, []);

  const menuItems = [
    // { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'User Management', icon: Users, path: '/admin/users' },
    { name: 'Videos', icon: Video, path: '/admin/videos' },
  ];

  const displayName = adminUser?.username || 'Admin';
  const initial = displayName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logoutAdminAction(); // this will delete cookies and redirect to /login
      // The redirect happens inside the server action, but we still call router.push as fallback
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-gray-900 text-white flex flex-col z-20 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand / Logo */}
     {/* 🚨 Outer div ko Link se replace kar diya aur href="/" lagaya */}
      <Link 
        href="/" 
        className={`h-20 flex items-center gap-3 px-6 border-b border-gray-800 hover:bg-gray-800/30 transition-colors cursor-pointer ${collapsed ? 'justify-center px-2' : ''}`}
      >
        <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center text-gray-900 shrink-0 shadow-sm">
          <PawPrint size={24} />
        </div>
        {!collapsed && (
          <div>
            <h1 className="font-black text-xl tracking-tight text-white">
              Mazito<span className="text-yellow-500">Admin</span>
            </h1>
          </div>
        )}
      </Link>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-4">
        {!collapsed && (
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 px-2">Main Menu</p>
        )}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const isActive = item.path === '/admin' 
              ? pathname === '/admin'
              : pathname.startsWith(item.path);
            const Icon = item.icon;
            return (
              <Link 
                key={item.name} 
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                  isActive 
                    ? 'bg-yellow-500 text-gray-900 shadow-md shadow-yellow-500/20' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                } ${collapsed ? 'justify-center' : ''}`}
                title={collapsed ? item.name : ''}
              >
                <Icon size={20} className={isActive ? 'text-gray-900' : 'text-gray-400'} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Admin Profile & Logout */}
     <div className="p-4 border-t border-gray-800">
        {!collapsed && (
          <div className="bg-gray-800 rounded-xl p-4 mb-3">
            <div className="flex items-center gap-3">
              {/* ✅ FIX: Added shrink-0 and overflow-hidden */}
              <div className="w-10 h-10 shrink-0 rounded-full bg-gray-700 flex items-center justify-center text-yellow-500 font-bold overflow-hidden relative">
                {adminUser?.profileImage && !adminUser.profileImage.includes('default.png') ? (
                  <img 
                    src={adminUser.profileImage} 
                    alt={displayName} 
                    width={40} // Added explicit dimensions for better rendering
                    height={40}
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  initial
                )}
              </div>
              {/* ✅ FIX: Added overflow-hidden to text container so long emails don't break layout */}
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-white truncate">{displayName}</p>
                <p className="text-xs text-yellow-500 truncate">{adminUser?.email || 'Admin'}</p>
              </div>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center mb-3">
            {/* ✅ FIX: Added shrink-0 and overflow-hidden here too */}
            <div className="w-10 h-10 shrink-0 rounded-full bg-gray-700 flex items-center justify-center text-yellow-500 font-bold overflow-hidden relative">
              {adminUser?.profileImage && !adminUser.profileImage.includes('default.png') ? (
                <img 
                  src={adminUser.profileImage} 
                  alt={displayName} 
                  width={40}
                  height={40}
                  className="w-full h-full object-cover" 
                />
              ) : (
                initial
              )}
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={20} />
          {!collapsed && (isLoggingOut ? 'Signing out...' : 'Sign Out')}
        </button>
      </div>
    </aside>
  );
}