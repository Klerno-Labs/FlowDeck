'use client';

import { Shield, Users, Lock, Eye, Edit, Trash2 } from 'lucide-react';

export default function PermissionsPage() {
  const roles = [
    {
      name: 'Dev',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      icon: Shield,
      description: 'Full system access with all permissions',
      permissions: ['Create', 'Read', 'Update', 'Delete', 'Manage Users', 'System Settings'],
    },
    {
      name: 'Admin',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      icon: Lock,
      description: 'Content management and user oversight',
      permissions: ['Create', 'Read', 'Update', 'Delete', 'Manage Content'],
    },
    {
      name: 'Sales',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      icon: Eye,
      description: 'View and edit content, no user management',
      permissions: ['Create', 'Read', 'Update', 'Limited Delete'],
    },
  ];

  return (
    <div className="max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-gray-900 mb-2">Role Permissions</h1>
        <p className="text-xl text-gray-600">
          View and manage access control for different user roles
        </p>
      </div>

      {/* Current Permissions Grid */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <div
              key={role.name}
              className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden"
            >
              {/* Role Header */}
              <div className={`bg-gradient-to-r ${role.color} p-6`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                    <span className="text-xs font-bold text-white">Active</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{role.name}</h3>
                <p className="text-sm text-white/80">{role.description}</p>
              </div>

              {/* Permissions List */}
              <div className="p-6">
                <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Permissions</h4>
                <div className="space-y-2">
                  {role.permissions.map((permission) => (
                    <div
                      key={permission}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                    >
                      <div className={`w-8 h-8 rounded-lg ${role.bgColor} flex items-center justify-center`}>
                        {permission.toLowerCase().includes('create') && <Edit className="w-4 h-4 text-gray-700" />}
                        {permission.toLowerCase().includes('read') && <Eye className="w-4 h-4 text-gray-700" />}
                        {permission.toLowerCase().includes('update') && <Edit className="w-4 h-4 text-gray-700" />}
                        {permission.toLowerCase().includes('delete') && <Trash2 className="w-4 h-4 text-gray-700" />}
                        {permission.toLowerCase().includes('manage') && <Users className="w-4 h-4 text-gray-700" />}
                        {permission.toLowerCase().includes('system') && <Shield className="w-4 h-4 text-gray-700" />}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{permission}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Panel */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl shadow-lg border-2 border-amber-100 p-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Current Permission Model</h3>
            <p className="text-gray-700 mb-4">
              All authenticated users can currently edit content. The system tracks changes with user attribution for auditing purposes.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4">
                <h4 className="font-bold text-gray-900 mb-2">✓ Everyone Can Edit</h4>
                <p className="text-sm text-gray-600">All logged-in users have full content editing capabilities</p>
              </div>
              <div className="bg-white rounded-xl p-4">
                <h4 className="font-bold text-gray-900 mb-2">📝 Change Tracking</h4>
                <p className="text-sm text-gray-600">All modifications are logged with user ID and timestamp</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
