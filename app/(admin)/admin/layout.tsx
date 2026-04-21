"use client";
import AdminSidebar from '@/components/admin/Sidebar';
import AdminHeader from '@/components/admin/Header';
import { useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => setSidebarCollapsed(prev => !prev);
  return (
    <div className="min-h-screen bg-gray-50 font-sans flex">
      {/* Fixed Sidebar */}
         <AdminSidebar collapsed={sidebarCollapsed} />
      
      {/* Main Content Area (Offset by sidebar width 64 units = 16rem/256px) */}
       <div className={` flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
           <AdminHeader onToggleSidebar={toggleSidebar} />
        
        {/* Page Content goes here */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}