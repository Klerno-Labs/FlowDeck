'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { canManageUsers, canAssignRole, canDeleteUser, getAssignableRoles, getRoleDisplayName } from '@/lib/auth/authorization';

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

  async function handleDeleteUser(userId: string) {
    if (!confirm('Are you sure you want to delete this user?')) {
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
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!session?.user || !canManageUsers(session.user.role as any)) {
    return null;
  }

  const userRole = session.user.role as 'dev' | 'admin' | 'sales';
  const assignableRoles = getAssignableRoles(userRole);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="mt-2 text-gray-600">Manage user accounts and permissions</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Add User
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Last Login
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {users.map((user) => {
                const isSelf = user.id === session.user.id;
                const canEdit = canAssignRole(userRole, user.role);
                const canDelete = canDeleteUser(userRole, user.role, isSelf);

                return (
                  <tr key={user.id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {user.name}
                      {isSelf && <span className="ml-2 text-gray-500">(You)</span>}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {canEdit && assignableRoles.length > 0 ? (
                        <select
                          value={user.role}
                          onChange={(e) => handleUpdateRole(user.id, e.target.value as any)}
                          className="rounded border border-gray-300 px-2 py-1 text-sm"
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
                        <span className="inline-flex rounded-full bg-blue-100 px-2 text-xs font-semibold leading-5 text-blue-800">
                          {getRoleDisplayName(user.role)}
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {user.last_successful_login
                        ? new Date(user.last_successful_login).toLocaleDateString()
                        : 'Never'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      {canDelete && (
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900"
                        >
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

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold">Create New User</h2>
            <form onSubmit={handleCreateUser}>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded border border-gray-300 px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded border border-gray-300 px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full rounded border border-gray-300 px-3 py-2"
                  required
                  minLength={8}
                />
              </div>
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  className="w-full rounded border border-gray-300 px-3 py-2"
                >
                  {assignableRoles.map((role) => (
                    <option key={role} value={role}>
                      {getRoleDisplayName(role)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setError('');
                  }}
                  className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
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
