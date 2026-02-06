'use client';

import { useState, useEffect } from 'react';
import { Users, Plus, Pencil, Trash2, Shield, Mail, Calendar, Loader2 } from 'lucide-react';
import { showToast } from '@/components/ui/Toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'dev' | 'admin' | 'sales';
  created_at: string;
}

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch users from API
    // For now, showing placeholder
    setLoading(false);
  }, []);

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'dev':
        return 'bg-purple-500 text-white';
      case 'admin':
        return 'bg-blue-500 text-white';
      case 'sales':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-5xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-xl text-gray-600">
            Manage user accounts and permissions
          </p>
        </div>
        <button
          onClick={() => showToast('User creation coming soon!', 'info')}
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl hover:shadow-xl hover:scale-105 transition-all text-lg font-bold shadow-lg shadow-blue-500/30 active:scale-95 touch-manipulation"
        >
          <Plus className="w-6 h-6" />
          Add User
        </button>
      </div>

      {/* Coming Soon Card */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl shadow-xl border-2 border-blue-100 p-12 text-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Users className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">User Management Coming Soon</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          This feature will allow you to create, edit, and manage user accounts with different permission levels (Dev, Admin, Sales).
        </p>

        {/* Feature Preview */}
        <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
              <Plus className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Create Users</h3>
            <p className="text-sm text-gray-600">Add new team members with specific roles</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Manage Permissions</h3>
            <p className="text-sm text-gray-600">Control access levels and capabilities</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Track Activity</h3>
            <p className="text-sm text-gray-600">Monitor user actions and changes</p>
          </div>
        </div>
      </div>
    </div>
  );
}
