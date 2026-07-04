import { useState, useEffect, useRef } from 'react';
import { Upload, Image as ImageIcon, Video, FileText, Folder, Trash2, Search, Plus, X } from 'lucide-react';
import AdminTabNavigation from '@/Components/Admin/AdminTabNavigation';

export default function MediaLibraryPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [media, setMedia] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'images', label: 'Images' },
    { id: 'videos', label: 'Videos' },
    { id: 'documents', label: 'Documents' },
    { id: 'folders', label: 'Folders' },
  ];

  useEffect(() => {
    loadMedia();
    loadFolders();
  }, [selectedFolder, activeTab]);

  const loadMedia = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedFolder) params.append('folder_id', selectedFolder);
      if (activeTab !== 'all' && activeTab !== 'folders') params.append('type', activeTab);
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`/api/admin/cms/media?${params}`);
      const data = await response.json();
      setMedia(data.data?.data || []);
    } catch (err) {
      console.error('Failed to load media:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadFolders = async () => {
    try {
      const response = await fetch('/api/admin/cms/folders');
      const data = await response.json();
      setFolders(data.data || []);
    } catch (err) {
      console.error('Failed to load folders:', err);
    }
  };

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    setUploading(true);
    const formData = new FormData();
    
    for (let i = 0; i < files.length; i++) {
      formData.append('file', files[i]);
    }
    
    if (selectedFolder) formData.append('folder_id', selectedFolder);

    try {
      const response = await fetch('/api/admin/cms/media/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        setShowUploadModal(false);
        loadMedia();
      }
    } catch (err) {
      console.error('Failed to upload:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    
    try {
      await fetch(`/api/admin/cms/media/${id}`, { method: 'DELETE' });
      setMedia(media.filter(m => m.id !== id));
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedMedia.length} files?`)) return;
    
    try {
      await fetch('/api/admin/cms/media/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedMedia }),
      });
      setSelectedMedia([]);
      loadMedia();
    } catch (err) {
      console.error('Failed to bulk delete:', err);
    }
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      await fetch('/api/admin/cms/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          slug: formData.get('name').toLowerCase().replace(/\s+/g, '-'),
        }),
      });
      
      setShowFolderModal(false);
      loadFolders();
    } catch (err) {
      console.error('Failed to create folder:', err);
    }
  };

  const getMediaIcon = (type) => {
    switch (type) {
      case 'image': return ImageIcon;
      case 'video': return Video;
      case 'document': return FileText;
      default: return FileText;
    }
  };

  const filteredMedia = media.filter(item => {
    if (activeTab === 'all' || activeTab === 'folders') return true;
    return item.file_type === activeTab;
  });

  return (
    <div>
      <AdminTabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Media Library</h1>
            <p className="text-sm text-slate-600">Manage your media files</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFolderModal(true)}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
            >
              <Folder className="h-4 w-4" />
              New Folder
            </button>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-700"
            >
              <Upload className="h-4 w-4" />
              Upload
            </button>
          </div>
        </div>

        {/* Folders */}
        {folders.length > 0 && (
          <div className="flex gap-4 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedFolder(null)}
              className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-semibold transition-colors ${
                selectedFolder === null
                  ? 'border-rose-600 bg-rose-50 text-rose-600'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Folder className="h-4 w-4" />
              All Files
            </button>
            {folders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => setSelectedFolder(folder.id)}
                className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-semibold transition-colors ${
                  selectedFolder === folder.id
                    ? 'border-rose-600 bg-rose-50 text-rose-600'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Folder className="h-4 w-4" />
                {folder.name}
              </button>
            ))}
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search media..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
          />
        </div>

        {/* Bulk Actions */}
        {selectedMedia.length > 0 && (
          <div className="flex items-center justify-between rounded-lg bg-rose-50 px-4 py-3">
            <span className="text-sm font-semibold text-rose-600">
              {selectedMedia.length} files selected
            </span>
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected
            </button>
          </div>
        )}

        {/* Media Grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-square rounded-lg bg-slate-200 animate-pulse" />
            ))}
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 py-12">
            <ImageIcon className="h-12 w-12 text-slate-300 mb-4" />
            <p className="text-sm font-semibold text-slate-500">No media files found</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="mt-4 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-700"
            >
              Upload Files
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            {filteredMedia.map((item) => {
              const Icon = getMediaIcon(item.file_type);
              return (
                <div
                  key={item.id}
                  className={`group relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                    selectedMedia.includes(item.id)
                      ? 'border-rose-600 bg-rose-50'
                      : 'border-slate-200 bg-white hover:border-rose-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedMedia.includes(item.id)}
                    onChange={() => {
                      setSelectedMedia(prev =>
                        prev.includes(item.id) ? prev.filter(id => id !== item.id) : [...prev, item.id]
                      );
                    }}
                    className="absolute top-2 left-2 z-10 h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                  />
                  
                  {item.file_type === 'image' ? (
                    <img
                      src={`/storage/${item.file_path}`}
                      alt={item.alt_text || item.file_name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-100">
                      <Icon className="h-12 w-12 text-slate-400" />
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black/0 opacity-0 transition-all group-hover:bg-black/50 group-hover:opacity-100">
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="truncate text-xs font-semibold text-white">{item.file_name}</p>
                      <p className="text-xs text-slate-300">
                        {(item.file_size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="absolute top-2 right-2 rounded-lg bg-red-600 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">Upload Files</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="rounded-lg p-2 hover:bg-slate-100"
              >
                <X className="h-5 w-5 text-slate-600" />
              </button>
            </div>
            
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-sm font-semibold text-slate-600 mb-2">
                Drag and drop files here
              </p>
              <p className="text-xs text-slate-500 mb-4">or</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-700 disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Browse Files'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Folder Modal */}
      {showFolderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">New Folder</h2>
              <button
                onClick={() => setShowFolderModal(false)}
                className="rounded-lg p-2 hover:bg-slate-100"
              >
                <X className="h-5 w-5 text-slate-600" />
              </button>
            </div>
            
            <form onSubmit={handleCreateFolder}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">Folder Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-800 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  placeholder="My Folder"
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowFolderModal(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-700"
                >
                  Create Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
