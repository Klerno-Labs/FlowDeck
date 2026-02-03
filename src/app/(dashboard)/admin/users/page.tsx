'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { canManageUsers, canAssignRole, canDeleteUser, getAssignableRoles, getRoleDisplayName } from '@/lib/auth/authorization';
import { X, UserPlus, Trash2, Home } from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'dev' | 'admin' | 'sales';
  created_at: string;
  created_by?: string;
  last_successful_login?: string;
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'sales' as 'dev' | 'admin' | 'sales',
  });

  // Check permissions
  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user) {
      router.push('/login');
      return;
    }

    if (!canManageUsers(session.user.role as any)) {
      router.push('/home');
      return;
    }

    loadUsers();
  }, [session, status, router]);

  async function loadUsers() {
    try {
      const response = await fetch('/api/admin/users');

      if (!response.ok) {
        throw new Error('Failed to load users');
      }

      const data = await response.json();
      setUsers(data.users);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create user');
      }

      setShowCreateModal(false);
      setFormData({ email: '', password: '', name: '', role: 'sales' });
      loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    }
  }

  async function handleUpdateRole(userId: string, newRole: 'dev' | 'admin' | 'sales') {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update role');
      }

      loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role');
    }
  }

  async function handleDeleteUser(userId: string, userName: string) {
    if (!confirm(`Are you sure you want to delete ${userName}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete user');
      }

      loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="fixed inset-0 bg-ftc-lightBlue flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!session?.user || !canManageUsers(session.user.role as any)) {
    return null;
  }

  const userRole = session.user.role as 'dev' | 'admin' | 'sales';
  const assignableRoles = getAssignableRoles(userRole);

  return (
    <div className="fixed inset-0 bg-ftc-lightBlue overflow-hidden">
      <div className="h-full w-full flex items-center justify-center p-8">
        <div className="w-full max-w-7xl h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">User Management</h1>
              <p className="mt-1 text-blue-100">Manage user accounts and permissions</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/home')}
                className="px-6 py-3 bg-white/20 hover:bg-white/30 active:bg-white/40 text-white rounded-lg transition-all touch-manipulation min-h-[44px] flex items-center gap-2 font-medium"
              >
                <Home className="w-5 h-5" />
                Home
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-white hover:bg-gray-100 active:bg-gray-200 text-blue-700 rounded-lg transition-all touch-manipulation min-h-[44px] flex items-center gap-2 font-medium shadow-md"
              >
                <UserPlus className="w-5 h-5" />
                Add User
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-8 mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* User Table */}
          <div className="flex-1 overflow-auto px-8 py-6">
            <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => {
                    const isSelf = user.id === session.user.id;
                    const canEdit = canAssignRole(userRole, user.role);
                    const canDelete = canDeleteUser(userRole, user.role, isSelf);

                    return (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-base font-medium text-gray-900">
                              {user.name}
                              {isSelf && <span className="ml-2 text-sm text-gray-500">(You)</span>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-600">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {canEdit && assignableRoles.length > 0 ? (
                            <select
                              value={user.role}
                              onChange={(e) => handleUpdateRole(user.id, e.target.value as any)}
                              className="px-4 py-2 border-2 border-gray-300 rounded-lg text-base font-medium touch-manipulation min-h-[44px] bg-white hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            >
                              {assignableRoles.map((role) => (
                                <option key={role} value={role}>
                                  {getRoleDisplayName(role)}
                                </option>
                              ))}
                              {!assignableRoles.includes(user.role) && (
                                <option value={user.role} disabled>
                                  {getRoleDisplayName(user.role)}
                                </option>
                              )}
                            </select>
                          ) : (
                            <span className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-100 text-blue-800 text-sm font-semibold">
                              {getRoleDisplayName(user.role)}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-600">
                          {user.last_successful_login
                            ? new Date(user.last_successful_login).toLocaleDateString()
                            : 'Never'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {canDelete && (
                            <button
                              onClick={() => handleDeleteUser(user.id, user.name)}
                              className="p-3 text-red-600 hover:bg-red-50 active:bg-red-100 rounded-lg transition-all touch-manipulation inline-flex items-center gap-2 font-medium"
                            >
                              <Trash2 className="w-5 h-5" />
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Create User Modal - iPad Optimized */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-8">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Create New User</h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setError('');
                }}
                className="p-2 hover:bg-white/20 active:bg-white/30 rounded-lg transition-all touch-manipulation"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all touch-manipulation"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all touch-manipulation"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all touch-manipulation"
                  required
                  minLength={8}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all touch-manipulation"
                >
                  {assignableRoles.map((role) => (
                    <option key={role} value={role}>
                      {getRoleDisplayName(role)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setError('');
                  }}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-all touch-manipulation min-h-[52px] font-medium text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg transition-all touch-manipulation min-h-[52px] font-medium text-base shadow-md"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
