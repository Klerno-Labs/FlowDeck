'use client';

import { Settings, Database, Image as ImageIcon, Zap, Bell, Lock } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-gray-900 mb-2">Admin Settings</h1>
        <p className="text-xl text-gray-600">
          Configure system preferences and options
        </p>
      </div>

      {/* Coming Soon Card */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl shadow-xl border-2 border-purple-100 p-12 text-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Settings className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Settings Panel Coming Soon</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Configure system-wide settings including database connections, storage preferences, notifications, and security options.
        </p>

        {/* Settings Categories Preview */}
        <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-6 shadow-md text-left">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
              <Database className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2 text-lg">Database Settings</h3>
            <p className="text-sm text-gray-600 mb-4">Configure PostgreSQL connection and backup preferences</p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                Connection pooling
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                Automatic backups
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                Query optimization
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md text-left">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mb-4">
              <ImageIcon className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2 text-lg">Storage & Media</h3>
            <p className="text-sm text-gray-600 mb-4">Manage Vercel Blob storage and CDN settings</p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                Storage limits
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                Image optimization
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                CDN configuration
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md text-left">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2 text-lg">Real-Time Updates</h3>
            <p className="text-sm text-gray-600 mb-4">Configure sync interval and update behavior</p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                Polling interval
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                WebSocket support
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                Cache strategies
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md text-left">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2 text-lg">Security & Auth</h3>
            <p className="text-sm text-gray-600 mb-4">Manage authentication and security policies</p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                Session timeout
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                2FA settings
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                Password policies
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
