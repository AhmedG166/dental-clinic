'use client';

import { useRouter, usePathname } from 'next/navigation';
import { ReactNode, useState } from 'react';
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  Settings,
  LogOut,
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'Appointments', icon: Calendar, path: '/admin/appointments' },
    { name: 'Patients', icon: Users, path: '/admin/patients', disabled: true },
    { name: 'Reports', icon: FileText, path: '/admin/reports', disabled: true },
    { name: 'Settings', icon: Settings, path: '/admin/settings', disabled: true },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${collapsed ? 'w-20' : 'w-64'} border-r border-gray-200 bg-white flex flex-col transition-all`}>
        
        {/* Logo */}
        <div className="h-20 border-b border-gray-100 flex items-center justify-center px-4">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <span className="text-3xl">🦷</span>
              <div>
                <div className="font-bold text-gray-900">SmileCare</div>
                <div className="text-xs text-gray-500">Admin Panel</div>
              </div>
            </div>
          )}
          {collapsed && <span className="text-3xl">🦷</span>}
        </div>

        {/* Menu Items */}
        <div className="flex-1 p-3 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => !item.disabled && router.push(item.path)}
                disabled={item.disabled}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-blue-50 text-blue-700' 
                    : item.disabled 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
                {!collapsed && item.disabled && (
                  <span className="ml-auto text-xs bg-gray-200 px-2 py-0.5 rounded">Soon</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Logout */}
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={() => {
              localStorage.removeItem('adminAuth');
              router.push('/admin/login');
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
