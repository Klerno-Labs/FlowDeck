'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { X, Upload, Search, Trash2, Image as ImageIcon, FolderPlus, Folder, Grid3x3, List, Download } from 'lucide-react';
import Image from 'next/image';
import { showToast } from '@/components/ui/Toast';
import { safeLocalStorage } from '@/lib/error-handler';
import { useDebounce } from '@/lib/performance';

interface AssetItem {
  id: string;
  name: string;
  url: string;
  size: number; // bytes
  width: number;
  height: number;
  type: string;
  folder: string;
  uploadedAt: string;
}

interface AssetManagerProps {
  onClose: () => void;
  onSelectAsset: (url: string) => void;
}

export function AssetManager({ onClose, onSelectAsset }: AssetManagerProps) {
  const [assets, setAssets] = useState<AssetItem[]>([]);
  const [folders, setFolders] = useState<string[]>(['All Assets', 'Uncategorized']);
  const [selectedFolder, setSelectedFolder] = useState('All Assets');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300); // Debounce search for better performance
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load assets from localStorage
  useEffect(() => {
    const parsedAssets = safeLocalStorage.getItem('page-builder-assets', []);
    setAssets(parsedAssets);

    // Extract unique folders
    const uniqueFolders = Array.from(new Set(parsedAssets.map((a: AssetItem) => a.folder)));
    setFolders(['All Assets', ...uniqueFolders.filter((f: string) => f !== 'All Assets')]);
  }, []);

  // Upload files
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAssets: AssetItem[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) {
        showToast('Only image files are supported', 'error');
        continue;
      }

      // Read file as data URL
      const reader = new FileReader();
      reader.onload = async (event) => {
        const dataUrl = event.target?.result as string;

        // Get image dimensions
        const img = document.createElement('img');
        img.onload = () => {
          const asset: AssetItem = {
            id: `asset-${Date.now()}-${Math.random()}`,
            name: file.name,
            url: dataUrl,
            size: file.size,
            width: img.width,
            height: img.height,
            type: file.type,
            folder: selectedFolder === 'All Assets' ? 'Uncategorized' : selectedFolder,
            uploadedAt: new Date().toISOString(),
          };

          newAssets.push(asset);

          if (newAssets.length === files.length) {
            const updated = [...assets, ...newAssets];
            setAssets(updated);
            safeLocalStorage.setItem('page-builder-assets', updated);
            showToast(`${newAssets.length} image(s) uploaded successfully`, 'success');
          }
        };
        img.src = dataUrl;
      };

      reader.readAsDataURL(file);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Delete asset
  const deleteAsset = (id: string) => {
    if (window.confirm('Delete this asset? This cannot be undone.')) {
      const updated = assets.filter((a) => a.id !== id);
      setAssets(updated);
      safeLocalStorage.setItem('page-builder-assets', updated);
      setSelectedAssets(selectedAssets.filter((aid) => aid !== id));
      showToast('Asset deleted', 'success');
    }
  };

  // Delete multiple assets
  const deleteBulk = () => {
    if (window.confirm(`Delete ${selectedAssets.length} selected asset(s)? This cannot be undone.`)) {
      const updated = assets.filter((a) => !selectedAssets.includes(a.id));
      setAssets(updated);
      safeLocalStorage.setItem('page-builder-assets', updated);
      setSelectedAssets([]);
      showToast(`${selectedAssets.length} asset(s) deleted`, 'success');
    }
  };

  // Create new folder
  const createFolder = () => {
    if (!newFolderName.trim()) return;

    if (folders.includes(newFolderName.trim())) {
      showToast('Folder already exists', 'error');
      return;
    }

    setFolders([...folders, newFolderName.trim()]);
    setNewFolderName('');
    setShowNewFolderDialog(false);
    showToast('Folder created', 'success');
  };

  // Filter assets (memoized for performance)
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesFolder = selectedFolder === 'All Assets' || asset.folder === selectedFolder;
      const matchesSearch = debouncedSearchQuery === '' || asset.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      return matchesFolder && matchesSearch;
    });
  }, [assets, selectedFolder, debouncedSearchQuery]);

  // Format file size
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Download asset
  const downloadAsset = (asset: AssetItem) => {
    const link = document.createElement('a');
    link.href = asset.url;
    link.download = asset.name;
    link.click();
  };

  // Toggle asset selection
  const toggleAssetSelection = (id: string) => {
    setSelectedAssets((prev) =>
      prev.includes(id) ? prev.filter((aid) => aid !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex">
        {/* Left Sidebar - Folders */}
        <div className="w-64 border-r border-gray-200 flex flex-col bg-gray-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Folders</h3>
            <button
              onClick={() => setShowNewFolderDialog(true)}
              className="w-full flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <FolderPlus className="w-4 h-4" />
              New Folder
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {folders.map((folder) => (
              <button
                key={folder}
                onClick={() => setSelectedFolder(folder)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-left mb-1 ${
                  selectedFolder === folder
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <Folder className="w-4 h-4" />
                <span className="text-sm truncate">{folder}</span>
                <span className="ml-auto text-xs text-gray-500">
                  {folder === 'All Assets'
                    ? assets.length
                    : assets.filter((a) => a.folder === folder).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-cyan-500">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <ImageIcon className="w-6 h-6 text-white" />
                <h2 className="text-2xl font-bold text-white">Asset Manager</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search & Actions */}
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
                <input
                  type="text"
                  placeholder="Search assets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/20 text-white placeholder-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-white/30 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                  title="Grid View"
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-white/30 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-white/90 transition-colors font-medium"
              >
                <Upload className="w-4 h-4" />
                Upload
              </button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedAssets.length > 0 && (
            <div className="px-6 py-3 bg-blue-50 border-b border-blue-200 flex items-center justify-between">
              <p className="text-sm font-medium text-blue-900">
                {selectedAssets.length} asset(s) selected
              </p>
              <button
                onClick={deleteBulk}
                className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Selected
              </button>
            </div>
          )}

          {/* Assets Grid/List */}
          <div className="flex-1 overflow-y-auto p-6">
            {filteredAssets.length === 0 ? (
              <div className="text-center py-20">
                <ImageIcon className="w-20 h-20 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Assets Yet</h3>
                <p className="text-gray-500 mb-6">
                  Upload images to start building your asset library
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg"
                >
                  <Upload className="w-5 h-5" />
                  <span className="font-semibold">Upload Your First Image</span>
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className={`group relative border-2 rounded-xl overflow-hidden hover:shadow-xl transition-all cursor-pointer ${
                      selectedAssets.includes(asset.id)
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => toggleAssetSelection(asset.id)}
                  >
                    {/* Image Preview */}
                    <div className="aspect-square bg-gray-100 relative">
                      <Image
                        src={asset.url}
                        alt={asset.name}
                        fill
                        className="object-cover"
                      />
                      {selectedAssets.includes(asset.id) && (
                        <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-3 bg-white">
                      <p className="text-xs font-medium text-gray-900 truncate mb-1">{asset.name}</p>
                      <p className="text-xs text-gray-500">
                        {asset.width} × {asset.height} • {formatSize(asset.size)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectAsset(asset.url);
                          showToast('Asset added to canvas', 'success');
                        }}
                        className="p-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        title="Add to canvas"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadAsset(asset);
                        }}
                        className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        title="Download"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteAsset(asset.id);
                        }}
                        className="p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredAssets.map((asset) => (
                  <div
                    key={asset.id}
                    onClick={() => toggleAssetSelection(asset.id)}
                    className={`group flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedAssets.includes(asset.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={asset.url}
                        alt={asset.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate mb-1">{asset.name}</p>
                      <p className="text-sm text-gray-500">
                        {asset.width} × {asset.height} • {formatSize(asset.size)} • {asset.folder}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Uploaded {new Date(asset.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectAsset(asset.url);
                          showToast('Asset added to canvas', 'success');
                        }}
                        className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        Add to Canvas
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadAsset(asset);
                        }}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteAsset(asset.id);
                        }}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Folder Dialog */}
      {showNewFolderDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Create New Folder</h3>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              onKeyPress={(e) => e.key === 'Enter' && createFolder()}
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={createFolder}
                disabled={!newFolderName.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setShowNewFolderDialog(false);
                  setNewFolderName('');
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Need to import Plus for the grid view actions
import { Plus } from 'lucide-react';
