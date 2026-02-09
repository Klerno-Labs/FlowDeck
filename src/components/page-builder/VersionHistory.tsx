'use client';

import { useState, useEffect } from 'react';
import { PageConfig } from '@/types/page-builder';
import { X, Clock, RotateCcw, Trash2, Eye, Download } from 'lucide-react';
import { safeLocalStorage } from '@/lib/error-handler';

interface VersionSnapshot {
  id: string;
  pageKey: string;
  config: PageConfig;
  timestamp: string;
  description: string;
  changedBy?: string;
  changeType: 'create' | 'update' | 'delete' | 'restore';
}

interface VersionHistoryProps {
  onClose: () => void;
  currentPageKey: string;
  currentConfig: PageConfig;
  onRestore: (config: PageConfig) => void;
}

export function VersionHistory({
  onClose,
  currentPageKey,
  currentConfig,
  onRestore,
}: VersionHistoryProps) {
  const [versions, setVersions] = useState<VersionSnapshot[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<VersionSnapshot | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Load versions from localStorage
  useEffect(() => {
    const stored = safeLocalStorage.getItem(`page-builder-history-${currentPageKey}`);
    if (stored) {
      const parsed = safeLocalStorage.parseJSON(stored, []);
      setVersions(parsed);
    }
  }, [currentPageKey]);

  // Save version to history
  const saveVersion = (description: string, changeType: VersionSnapshot['changeType']) => {
    const newVersion: VersionSnapshot = {
      id: `version-${Date.now()}`,
      pageKey: currentPageKey,
      config: JSON.parse(JSON.stringify(currentConfig)), // Deep copy
      timestamp: new Date().toISOString(),
      description,
      changeType,
    };

    const updated = [newVersion, ...versions].slice(0, 50); // Keep last 50 versions
    setVersions(updated);
    safeLocalStorage.setItem(`page-builder-history-${currentPageKey}`, JSON.stringify(updated));
  };

  // Restore version
  const handleRestore = (version: VersionSnapshot) => {
    if (window.confirm(`Restore to version from ${formatDate(version.timestamp)}?`)) {
      onRestore(version.config);
      saveVersion(`Restored from ${formatDate(version.timestamp)}`, 'restore');
      onClose();
    }
  };

  // Delete version
  const deleteVersion = (id: string) => {
    const updated = versions.filter((v) => v.id !== id);
    setVersions(updated);
    safeLocalStorage.setItem(`page-builder-history-${currentPageKey}`, JSON.stringify(updated));
    if (selectedVersion?.id === id) {
      setSelectedVersion(null);
      setShowPreview(false);
    }
  };

  // Clear all history
  const clearHistory = () => {
    if (window.confirm('Delete all version history? This cannot be undone.')) {
      setVersions([]);
      safeLocalStorage.removeItem(`page-builder-history-${currentPageKey}`);
      setSelectedVersion(null);
      setShowPreview(false);
    }
  };

  // Export version as JSON
  const exportVersion = (version: VersionSnapshot) => {
    const dataStr = JSON.stringify(version.config, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = `page-${version.pageKey}-${version.timestamp}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Format date
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get change type badge
  const getChangeTypeBadge = (type: VersionSnapshot['changeType']) => {
    switch (type) {
      case 'create':
        return <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Created</span>;
      case 'update':
        return <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">Updated</span>;
      case 'delete':
        return <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">Deleted</span>;
      case 'restore':
        return <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">Restored</span>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex">
        {/* Left Panel - Version List */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-500 to-purple-500">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-white" />
                <h2 className="text-2xl font-bold text-white">Version History</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-white/90">{versions.length} versions saved</p>
          </div>

          {/* Actions */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <button
              onClick={clearHistory}
              disabled={versions.length === 0}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-sm font-medium">Clear All History</span>
            </button>
          </div>

          {/* Version List */}
          <div className="flex-1 overflow-y-auto p-4">
            {versions.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No History Yet</h3>
                <p className="text-sm text-gray-500">
                  Version snapshots will appear here as you make changes
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {versions.map((version, index) => (
                  <div
                    key={version.id}
                    onClick={() => {
                      setSelectedVersion(version);
                      setShowPreview(true);
                    }}
                    className={`group p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedVersion?.id === version.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-gray-500">#{versions.length - index}</span>
                        {getChangeTypeBadge(version.changeType)}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteVersion(version.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all"
                        title="Delete version"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-600" />
                      </button>
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-1">{version.description}</p>
                    <p className="text-xs text-gray-500 mb-3">{formatDate(version.timestamp)}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">
                        {version.config.elements.length} element{version.config.elements.length !== 1 ? 's' : ''}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            exportVersion(version);
                          }}
                          className="p-1 hover:bg-gray-200 rounded"
                          title="Export version"
                        >
                          <Download className="w-3.5 h-3.5 text-gray-600" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRestore(version);
                          }}
                          className="p-1 hover:bg-purple-200 rounded"
                          title="Restore version"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-purple-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="flex-1 flex flex-col">
          {showPreview && selectedVersion ? (
            <>
              {/* Preview Header */}
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">Preview</h3>
                  <button
                    onClick={() => handleRestore(selectedVersion)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span className="font-semibold">Restore This Version</span>
                  </button>
                </div>
                <p className="text-sm text-gray-600">{selectedVersion.description}</p>
                <p className="text-xs text-gray-500 mt-1">{formatDate(selectedVersion.timestamp)}</p>
              </div>

              {/* Preview Content */}
              <div className="flex-1 overflow-auto p-6 bg-gray-100">
                <div className="bg-white rounded-lg shadow-lg p-8 min-h-full">
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Page Configuration</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-xs text-blue-600 font-medium mb-1">Elements</p>
                        <p className="text-2xl font-bold text-blue-900">{selectedVersion.config.elements.length}</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-xs text-green-600 font-medium mb-1">Background</p>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded border border-gray-300"
                            style={{ backgroundColor: selectedVersion.config.styles.backgroundColor || '#ffffff' }}
                          />
                          <p className="text-sm font-mono text-green-900">
                            {selectedVersion.config.styles.backgroundColor || '#ffffff'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Elements List */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Elements in This Version</h4>
                    <div className="space-y-2">
                      {selectedVersion.config.elements.map((element, index) => (
                        <div
                          key={element.id}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold">
                            {index + 1}
                          </span>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {element.content || element.type}
                            </p>
                            <p className="text-xs text-gray-500">
                              {element.type} • x:{Math.round(element.position.x)} y:{Math.round(element.position.y)}
                            </p>
                          </div>
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: element.styles.backgroundColor || '#f3f4f6' }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Eye className="w-20 h-20 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a Version</h3>
                <p className="text-gray-500">
                  Click on a version from the list to preview its contents
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
