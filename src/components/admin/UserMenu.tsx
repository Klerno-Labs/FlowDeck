'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Settings, User, Users, LogOut, Shield, ChevronDown } from 'lucide-react';

interface UserMenuProps {
  user: {
    name: string;
    email?: string;
    role: string;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'dev':
        return 'bg-purple-500';
      case 'admin':
        return 'bg-blue-500';
      case 'sales':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Settings Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/30 flex items-center justify-center transition-all active:scale-95 touch-manipulation group"
        title="Settings & User Menu"
      >
        <Settings className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border-2 border-gray-100 overflow-hidden animate-in slide-in-from-top-2 duration-200 z-50">
          {/* User Info Section */}
          <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white">{user.name}</p>
                {user.email && (
                  <p className="text-xs text-white/80">{user.email}</p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <div className={`${getRoleBadgeColor(user.role)} px-2 py-0.5 rounded-full`}>
                    <span className="text-xs font-bold text-white uppercase">{user.role}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            <Link
              href="/admin/users"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 transition-colors group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">User Management</p>
                <p className="text-xs text-gray-500">Manage users and permissions</p>
              </div>
            </Link>

            <Link
              href="/admin/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-purple-50 transition-colors group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-50 group-hover:bg-purple-100 flex items-center justify-center transition-colors">
                <Settings className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">Admin Settings</p>
                <p className="text-xs text-gray-500">Configure system preferences</p>
              </div>
            </Link>

            <Link
              href="/admin/permissions"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-50 transition-colors group"
            >
              <div className="w-10 h-10 rounded-xl bg-green-50 group-hover:bg-green-100 flex items-center justify-center transition-colors">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">Permissions</p>
                <p className="text-xs text-gray-500">Manage access controls</p>
              </div>
            </Link>
          </div>

          {/* Divider */}
          <div className="border-t-2 border-gray-100 my-2"></div>

          {/* Logout */}
          <div className="p-2">
            <button
              onClick={() => {
                // Handle logout
                window.location.href = '/api/auth/signout';
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors group"
            >
              <div className="w-10 h-10 rounded-xl bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-colors">
                <LogOut className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-gray-900">Sign Out</p>
                <p className="text-xs text-gray-500">Exit admin interface</p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
