'use client';

import { 
  Users, 
  Video, 
  Flag, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreVertical,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { useEffect } from 'react';

// Import Recharts for the fixed chart
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// --- MOCK DATA ---
const KPI_STATS = [
  { title: 'Total Users', value: '24,592', change: '+12.5%', isUp: true, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
  { title: 'Active Videos', value: '8,234', change: '+5.2%', isUp: true, icon: Video, color: 'text-purple-600', bg: 'bg-purple-100' },
  { title: 'Pending Reports', value: '142', change: '-2.4%', isUp: false, icon: Flag, color: 'text-red-600', bg: 'bg-red-100' },
  { title: 'Engagement Rate', value: '68.4%', change: '+8.1%', isUp: true, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100' },
];

const RECENT_ACTIVITIES = [
  { id: 1, action: 'New Creator Verified', target: '@sara_creates', time: '10 mins ago', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 2, action: 'Video removed (Policy)', target: 'Video ID #8821', time: '1 hour ago', icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-50' },
  { id: 3, action: 'New pet trend viral', target: '#CatOlympics', time: '3 hours ago', icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-50' },
  { id: 4, action: 'System maintenance', target: 'Server Block A', time: 'Yesterday', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
];

const PENDING_REPORTS = [
  { id: 101, user: '@toxic_user1', reason: 'Hate Speech', severity: 'High', date: '2 hours ago' },
  { id: 102, user: '@spam_bot22', reason: 'Spam Links', severity: 'Medium', date: '4 hours ago' },
  { id: 103, user: '@fake_pets', reason: 'Impersonation', severity: 'High', date: '5 hours ago' },
];

// Data for the Recharts graph
const GROWTH_DATA = [
  { name: 'Mon', users: 4000, content: 2400 },
  { name: 'Tue', users: 3000, content: 1398 },
  { name: 'Wed', users: 2000, content: 9800 },
  { name: 'Thu', users: 2780, content: 3908 },
  { name: 'Fri', users: 1890, content: 4800 },
  { name: 'Sat', users: 2390, content: 3800 },
  { name: 'Sun', users: 3490, content: 4300 },
];


import { useRouter } from 'next/navigation'; // next/router nahi, next/navigation use karein

export default function RedirectComponent() {
  const router = useRouter(); // Router initialize karein

  useEffect(() => {
    // Sahi syntax: Quotes ke andar exact path
    router.push('/admin/users'); 
  }, [router]);

  return (
    <div className="p-10 text-center">
      <p className="text-gray-500 font-medium">Redirecting to Users page...</p>
    </div>
  );
}



// export default function AdminDashboard() {
//   return (
//     <div className="space-y-6">
      
//       {/* 1. Welcome Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
//         <div>
//           <h1 className="text-2xl font-black text-gray-900">Dashboard Overview</h1>
//           <p className="text-sm font-medium text-gray-500 mt-1">Here's what's happening on Mazito Social today.</p>
//         </div>
//         <div className="flex items-center gap-3 bg-white px-4 py-2 border border-gray-200 rounded-xl shadow-sm">
//           <Clock size={16} className="text-gray-400" />
//           <span className="text-sm font-bold text-gray-700">
//             {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
//           </span>
//         </div>
//       </div>

//       {/* 2. KPI Cards Grid (Back to standard format) */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {KPI_STATS.map((stat, index) => {
//           const Icon = stat.icon;
//           return (
//             <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow group">
//               <div className="flex items-start justify-between mb-4">
//                 <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
//                   <Icon size={24} />
//                 </div>
//                 <button className="text-gray-400 hover:text-gray-900 transition-colors">
//                   <MoreVertical size={18} />
//                 </button>
//               </div>
//               <div>
//                 <p className="text-sm font-bold text-gray-500 mb-1">{stat.title}</p>
//                 <div className="flex items-end gap-3">
//                   <h3 className="text-3xl font-black text-gray-900">{stat.value}</h3>
//                   <span className={`flex items-center text-sm font-bold mb-1 ${stat.isUp ? 'text-green-600' : 'text-red-600'}`}>
//                     {stat.isUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
//                     {stat.change}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* 3. Main Content Area (Charts & Lists) */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
//         {/* Left Col: Platform Growth Chart (NOW USING RECHARTS) */}
//         <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//           <div className="flex items-center justify-between mb-8">
//             <div>
//               <h3 className="text-lg font-black text-gray-900">Platform Growth</h3>
//               <p className="text-sm text-gray-500 font-medium">New users vs Content uploaded (Last 7 Days)</p>
//             </div>
//             <select className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 outline-none cursor-pointer">
//               <option>This Week</option>
//               <option>Last Week</option>
//               <option>This Month</option>
//             </select>
//           </div>
          
//           {/* Simple Recharts Implementation */}
//           <div className="h-64 w-full">
//             <ResponsiveContainer width="100%" height="100%">
//               <AreaChart
//                 data={GROWTH_DATA}
//                 margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
//               >
//                 <defs>
//                   <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
//                     <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
//                   </linearGradient>
//                   <linearGradient id="colorContent" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#111827" stopOpacity={0.8}/>
//                     <stop offset="95%" stopColor="#111827" stopOpacity={0}/>
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
//                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
//                 <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
//                 <Tooltip 
//                   contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
//                 />
//                 <Area type="monotone" dataKey="users" stroke="#f59e0b" fillOpacity={1} fill="url(#colorUsers)" />
//                 <Area type="monotone" dataKey="content" stroke="#111827" fillOpacity={1} fill="url(#colorContent)" />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Right Col: Recent Activity */}
//         <div className="space-y-6">
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//             <h3 className="text-lg font-black text-gray-900 mb-6">Recent Activity</h3>
//             <div className="space-y-5">
//               {RECENT_ACTIVITIES.map((activity) => {
//                 const Icon = activity.icon;
//                 return (
//                   <div key={activity.id} className="flex gap-4">
//                     <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${activity.bg} ${activity.color}`}>
//                       <Icon size={18} />
//                     </div>
//                     <div>
//                       <p className="text-sm font-bold text-gray-900">{activity.action}</p>
//                       <p className="text-xs text-gray-500 font-medium">{activity.target} • {activity.time}</p>
//                     </div>
//                   </div>
//                 )
//               })}
//             </div>
//             <button className="w-full mt-6 py-2.5 bg-gray-50 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors">
//               View All Logs
//             </button>
//           </div>
//         </div>

//       </div>

//       {/* 4. Bottom Section: Action Needed (Reports) */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//         <div className="flex items-center justify-between mb-6">
//           <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
//             <ShieldAlert size={20} className="text-red-500" /> Action Needed: Reports
//           </h3>
//           <button className="text-sm font-bold text-yellow-600 hover:text-yellow-700">View All</button>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {PENDING_REPORTS.map((report) => (
//             <div key={report.id} className="border border-gray-200 rounded-xl p-4 hover:border-red-300 hover:bg-red-50/30 transition-colors">
//               <div className="flex justify-between items-start mb-2">
//                 <span className="text-sm font-bold text-gray-900">{report.user}</span>
//                 <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-bold">
//                   {report.severity}
//                 </span>
//               </div>
//               <p className="text-sm text-gray-600 mb-4"><span className="font-medium text-gray-500">Reason:</span> {report.reason}</p>
//               <div className="flex items-center justify-between">
//                 <span className="text-xs text-gray-400 font-medium">{report.date}</span>
//                 <button className="text-xs font-bold text-gray-900 hover:text-red-600 transition-colors">Review Now &rarr;</button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//     </div>
//   );
// }