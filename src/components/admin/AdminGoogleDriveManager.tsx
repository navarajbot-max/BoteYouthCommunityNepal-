/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { User } from 'firebase/auth';
import {
  initDriveAuth,
  signInWithGoogleDrive,
  signOutGoogleDrive,
  fetchDriveFiles,
  uploadFileToDrive,
  createDriveFolder,
  deleteDriveFile,
  DriveFileItem
} from '../../services/googleDriveService';
import {
  Folder,
  FileText,
  Image as ImageIcon,
  Film,
  Music,
  Trash2,
  Search,
  ExternalLink,
  Upload,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  FolderPlus,
  Shield,
  Loader2,
  HardDrive,
  KeyRound,
  Info,
  CheckSquare
} from 'lucide-react';

export default function AdminGoogleDriveManager() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [files, setFiles] = useState<DriveFileItem[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFolderId, setCurrentFolderId] = useState<string | undefined>(undefined);
  const [folderHistory, setFolderHistory] = useState<{ id?: string; name: string }[]>([
    { id: undefined, name: 'My Drive' }
  ]);

  // Specific error state tracking for clean UX
  const [hasInsufficientScopes, setHasInsufficientScopes] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Upload and folder creation state
  const [isUploading, setIsUploading] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [showFolderModal, setShowFolderModal] = useState(false);

  // Destructive operation confirmation modal state (Mandatory per workspace guidelines)
  const [fileToDelete, setFileToDelete] = useState<DriveFileItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = initDriveAuth(
      (authUser, authToken) => {
        setUser(authUser);
        setToken(authToken);
        setHasInsufficientScopes(false);
        loadFiles(undefined, authToken);
      },
      () => {
        setUser(null);
        setToken(null);
        setFiles([]);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const loadFiles = async (folderId?: string, _explicitToken?: string) => {
    setIsLoadingFiles(true);
    setErrorMsg(null);
    try {
      const items = await fetchDriveFiles(folderId, searchQuery);
      setFiles(items);
      setHasInsufficientScopes(false);
    } catch (err: any) {
      console.warn('Load drive files caught:', err);
      if (err.code === 'INSUFFICIENT_SCOPES' || err.message?.includes('permission')) {
        setHasInsufficientScopes(true);
        setErrorMsg('Drive permissions have not been granted for this session. Please re-authorize and check the Drive permission box.');
      } else if (err.code === 'AUTH_REQUIRED' || err.code === 'AUTH_EXPIRED') {
        setErrorMsg('Google Drive connection required. Please connect your account.');
      } else {
        setErrorMsg(err.message || 'Unable to fetch files from Google Drive.');
      }
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleSignIn = async () => {
    setIsAuthenticating(true);
    setErrorMsg(null);
    setHasInsufficientScopes(false);
    try {
      const { user: authUser, accessToken } = await signInWithGoogleDrive();
      setUser(authUser);
      setToken(accessToken);
      setStatusMsg(`Connected to Google Drive as ${authUser.email}`);
      await loadFiles(currentFolderId);
    } catch (err: any) {
      if (err.code === 'POPUP_CLOSED') {
        setStatusMsg('Sign-in window closed. Click "Connect Google Drive" whenever you are ready.');
      } else if (err.code === 'PERMISSION_DENIED') {
        setHasInsufficientScopes(true);
        setErrorMsg('Drive permission was not granted. In the Google authorization window, please check the box to allow Google Drive access.');
      } else {
        setErrorMsg(err.message || 'Google Drive authentication could not be completed.');
      }
    } finally {
      setIsAuthenticating(false);
      setTimeout(() => setStatusMsg(null), 6000);
    }
  };

  const handleSignOut = async () => {
    await signOutGoogleDrive();
    setUser(null);
    setToken(null);
    setFiles([]);
    setHasInsufficientScopes(false);
    setStatusMsg('Disconnected from Google Drive.');
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMsg(null);
    try {
      const uploaded = await uploadFileToDrive(file, currentFolderId);
      setStatusMsg(`Successfully uploaded "${uploaded.name}" to Google Drive!`);
      await loadFiles(currentFolderId);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      if (err.code === 'INSUFFICIENT_SCOPES') {
        setHasInsufficientScopes(true);
        setErrorMsg('Upload failed: Insufficient Drive permissions. Please click Grant Drive Permissions below.');
      } else {
        setErrorMsg(err.message || 'File upload failed.');
      }
    } finally {
      setIsUploading(false);
      setTimeout(() => setStatusMsg(null), 5000);
    }
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    try {
      const folder = await createDriveFolder(newFolderName.trim(), currentFolderId);
      setStatusMsg(`Folder "${folder.name}" created in Google Drive.`);
      setShowFolderModal(false);
      setNewFolderName('');
      await loadFiles(currentFolderId);
    } catch (err: any) {
      if (err.code === 'INSUFFICIENT_SCOPES') {
        setHasInsufficientScopes(true);
        setErrorMsg('Folder creation failed: Insufficient Drive permissions.');
      } else {
        setErrorMsg(err.message || 'Failed to create folder.');
      }
    } finally {
      setTimeout(() => setStatusMsg(null), 5000);
    }
  };

  const confirmDeleteFile = async () => {
    if (!fileToDelete) return;
    setIsDeleting(true);
    try {
      await deleteDriveFile(fileToDelete.id);
      setStatusMsg(`Removed "${fileToDelete.name}" from Google Drive.`);
      setFileToDelete(null);
      await loadFiles(currentFolderId);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete file.');
    } finally {
      setIsDeleting(false);
      setTimeout(() => setStatusMsg(null), 5000);
    }
  };

  const navigateToFolder = (folderId: string, folderName: string) => {
    setCurrentFolderId(folderId);
    setFolderHistory([...folderHistory, { id: folderId, name: folderName }]);
    loadFiles(folderId);
  };

  const navigateUp = (index: number) => {
    const target = folderHistory[index];
    setFolderHistory(folderHistory.slice(0, index + 1));
    setCurrentFolderId(target.id);
    loadFiles(target.id);
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('folder')) return <Folder className="w-5 h-5 text-amber-500 shrink-0" />;
    if (mimeType.includes('image')) return <ImageIcon className="w-5 h-5 text-blue-500 shrink-0" />;
    if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text')) {
      return <FileText className="w-5 h-5 text-emerald-600 shrink-0" />;
    }
    if (mimeType.includes('audio')) return <Music className="w-5 h-5 text-purple-500 shrink-0" />;
    if (mimeType.includes('video')) return <Film className="w-5 h-5 text-red-500 shrink-0" />;
    return <FileText className="w-5 h-5 text-slate-500 shrink-0" />;
  };

  const formatFileSize = (bytes?: string) => {
    if (!bytes) return '';
    const num = parseInt(bytes, 10);
    if (isNaN(num)) return '';
    if (num < 1024) return `${num} B`;
    if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
    return `${(num / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-[#003893]" />
            <h2 className="text-xl font-black text-slate-900 font-poppins">
              Google Drive Community Cloud Storage
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Securely store, organize, and view community archives, meeting resolutions, audio recordings, and cultural documents.
          </p>
        </div>

        {user && !hasInsufficientScopes ? (
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2">
            <div className="text-right">
              <div className="text-xs font-bold text-slate-900 truncate max-w-[180px]">
                {user.displayName || user.email}
              </div>
              <div className="text-[10px] text-emerald-700 font-bold flex items-center justify-end gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Drive Connected</span>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="text-xs font-bold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl transition cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        ) : (
          /* Official Google Sign In / Grant Button */
          <button
            onClick={handleSignIn}
            disabled={isAuthenticating}
            className="inline-flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-800 font-semibold px-5 py-2.5 rounded-2xl border border-slate-300 shadow-sm hover:shadow transition disabled:opacity-50 cursor-pointer"
          >
            {isAuthenticating ? (
              <>
                <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                <span className="text-xs font-bold">Connecting Drive...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                <span className="text-xs font-bold">
                  {hasInsufficientScopes ? 'Grant Drive Permissions' : 'Connect Google Drive'}
                </span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Helpful Permission Guidance Callout */}
      {hasInsufficientScopes && (
        <div className="p-5 bg-amber-50 border border-amber-200 rounded-3xl space-y-3">
          <div className="flex items-start gap-3">
            <KeyRound className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-amber-900">
                Google Drive Permission Required
              </h4>
              <p className="text-xs text-amber-800 leading-relaxed">
                When the Google authorization window appears, you must <strong>check the permission box</strong> that says:
              </p>
              <div className="inline-flex items-center gap-2 bg-white/80 border border-amber-300 rounded-xl px-3 py-1.5 text-xs font-bold text-amber-950 my-1">
                <CheckSquare className="w-4 h-4 text-emerald-600" />
                <span>"See, edit, create, and delete all of your Google Drive files"</span>
              </div>
              <p className="text-xs text-amber-800">
                If this box remains unchecked, Google cannot allow the app to view or upload community files.
              </p>
            </div>
          </div>
          <div className="pt-1 pl-8">
            <button
              onClick={handleSignIn}
              disabled={isAuthenticating}
              className="bg-amber-800 hover:bg-amber-900 text-white font-bold px-4 py-2 rounded-xl text-xs shadow flex items-center gap-2 transition cursor-pointer"
            >
              {isAuthenticating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Shield className="w-3.5 h-3.5" />}
              <span>Grant Permission &amp; Connect Drive</span>
            </button>
          </div>
        </div>
      )}

      {statusMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusMsg}</span>
          </div>
          <button onClick={() => setStatusMsg(null)} className="text-emerald-500 hover:text-emerald-800">&times;</button>
        </div>
      )}

      {errorMsg && !hasInsufficientScopes && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-red-500 hover:text-red-800">&times;</button>
        </div>
      )}

      {/* Main Drive View */}
      {!user || hasInsufficientScopes ? (
        <div className="bg-white rounded-3xl p-10 sm:p-12 text-center border border-slate-200 shadow-sm space-y-4">
          <div className="w-16 h-16 bg-blue-50 text-[#003893] rounded-2xl mx-auto flex items-center justify-center">
            <HardDrive className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Google Drive Integration</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Connect your Google account with Drive permission to view, organize, and upload Bote community files, meeting minutes, and audio recordings.
          </p>
          <div className="pt-2">
            <button
              onClick={handleSignIn}
              disabled={isAuthenticating}
              className="inline-flex items-center gap-2 bg-[#003893] hover:bg-blue-900 text-white font-bold px-6 py-3 rounded-2xl text-xs shadow transition cursor-pointer disabled:opacity-50"
            >
              {isAuthenticating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 text-amber-300" />
                  <span>Authorize Google Drive</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          {/* Breadcrumbs and Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            {/* Breadcrumb path */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold text-slate-600">
              {folderHistory.map((step, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <span className="text-slate-400">/</span>}
                  <button
                    onClick={() => navigateUp(idx)}
                    className={`hover:text-[#003893] transition ${
                      idx === folderHistory.length - 1 ? 'text-slate-900 font-extrabold' : ''
                    }`}
                  >
                    {step.name}
                  </button>
                </React.Fragment>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileUpload}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="bg-[#003893] hover:bg-blue-900 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow cursor-pointer"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload File</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setShowFolderModal(true)}
                className="bg-slate-900 hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow cursor-pointer"
              >
                <FolderPlus className="w-3.5 h-3.5" />
                <span>New Folder</span>
              </button>

              <button
                onClick={() => loadFiles(currentFolderId)}
                className="p-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl transition cursor-pointer"
                title="Refresh Drive"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingFiles ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  loadFiles(currentFolderId);
                }
              }}
              placeholder="Search files and documents in Drive... (Press Enter)"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-semibold text-slate-900 focus:bg-white focus:border-[#003893]"
            />
          </div>

          {/* Files List */}
          {isLoadingFiles ? (
            <div className="p-12 text-center text-slate-400 text-xs font-bold flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#003893]" />
              <span>Fetching Google Drive items...</span>
            </div>
          ) : files.length === 0 ? (
            <div className="p-10 text-center text-slate-400 text-xs space-y-2">
              <Folder className="w-10 h-10 mx-auto text-slate-300" />
              <p>No files or folders found in this folder.</p>
              <p className="text-[11px] text-slate-400">Click "Upload File" or "New Folder" above to add items.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {files.map((item) => {
                const isFolder = item.mimeType.includes('folder');
                return (
                  <div
                    key={item.id}
                    className="py-3 px-2 flex items-center justify-between hover:bg-slate-50 rounded-xl transition gap-3"
                  >
                    <div
                      onClick={() => isFolder && navigateToFolder(item.id, item.name)}
                      className={`flex items-center gap-3 flex-1 min-w-0 ${isFolder ? 'cursor-pointer' : ''}`}
                    >
                      {getFileIcon(item.mimeType)}
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate hover:text-[#003893]">
                          {item.name}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-2">
                          {item.size && <span>{formatFileSize(item.size)}</span>}
                          {item.modifiedTime && (
                            <span>Updated: {new Date(item.modifiedTime).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.webViewLink && (
                        <a
                          href={item.webViewLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-slate-400 hover:text-[#003893] transition"
                          title="Open in Google Drive"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={() => setFileToDelete(item)}
                        className="p-2 text-slate-400 hover:text-red-600 transition cursor-pointer"
                        title="Delete file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* New Folder Modal */}
      {showFolderModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl space-y-4">
            <h3 className="text-base font-black text-slate-900 font-poppins flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-amber-500" />
              <span>Create New Drive Folder</span>
            </h3>
            <form onSubmit={handleCreateFolder} className="space-y-4">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="e.g. Bote Cultural Audio & Records"
                required
                autoFocus
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowFolderModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Create Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mandatory User Confirmation Dialog for Destructive Operations */}
      {fileToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                Delete from Google Drive?
              </h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to delete <strong>"{fileToDelete.name}"</strong>? This will remove the file from your Google Drive with your permission.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setFileToDelete(null)}
                className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteFile}
                disabled={isDeleting}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Confirm Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
