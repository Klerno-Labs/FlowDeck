'use client';

import { useState, useEffect } from 'react';
import { History, RotateCcw, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Version {
  id: string;
  version_number: number;
  version_data: any;
  change_summary: string | null;
  created_by: string | null;
  created_at: string;
}

interface VersionHistoryProps {
  contentType: string;
  contentId: string;
  onRestore: (versionNumber: number) => Promise<void>;
  onClose: () => void;
}

/**
 * Version History Viewer
 * Shows all published versions with restore capability
 */
export function VersionHistory({
  contentType,
  contentId,
  onRestore,
  onClose,
}: VersionHistoryProps) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState<number | null>(null);

  useEffect(() => {
    fetchVersions();
  }, [contentType, contentId]);

  async function fetchVersions() {
    try {
      setLoading(true);
      const res = await fetch(`/api/versions/${contentType}/${contentId}?limit=50`);
      const data = await res.json();
      setVersions(data.versions || []);
    } catch (error) {
      console.error('Error fetching versions:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleRestore(versionNumber: number) {
    if (!confirm(`Restore version ${versionNumber}? This will replace your current draft.`)) {
      return;
    }

    try {
      setRestoring(versionNumber);
      await onRestore(versionNumber);
      onClose();
    } catch (error) {
      console.error('Error restoring version:', error);
      alert('Failed to restore version. Please try again.');
    } finally {
      setRestoring(null);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-8">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <History className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Version History</h2>
              <p className="text-sm text-gray-600">
                {versions.length} version{versions.length !== 1 ? 's' : ''} saved
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 transition-all active:scale-95"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Version List */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
            </div>
          ) : versions.length === 0 ? (
            <div className="text-center py-24">
              <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-600">No versions yet</p>
              <p className="text-gray-500 mt-2">
                Versions are created when you publish changes
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {versions.map((version, index) => {
                const isLatest = index === 0;
                const date = new Date(version.created_at);

                return (
                  <div
                    key={version.id}
                    className={`p-5 rounded-2xl border-2 transition-all ${
                      isLatest
                        ? 'border-blue-300 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                              isLatest
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            v{version.version_number}
                            {isLatest && ' (Latest)'}
                          </span>
                          <span className="text-sm text-gray-500">
                            {date.toLocaleDateString()} at {date.toLocaleTimeString()}
                          </span>
                        </div>

                        {version.change_summary && (
                          <p className="text-gray-700 mt-2">{version.change_summary}</p>
                        )}
                      </div>

                      <Button
                        onClick={() => handleRestore(version.version_number)}
                        disabled={restoring !== null || isLatest}
                        variant="secondary"
                        size="sm"
                      >
                        {restoring === version.version_number ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Restoring...
                          </>
                        ) : (
                          <>
                            <RotateCcw className="w-4 h-4" />
                            Restore
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t-2 border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600 text-center">
            💡 Restoring a version will replace your current draft. Your published content
            remains unchanged until you save and publish again.
          </p>
        </div>
      </div>
    </div>
  );
}
