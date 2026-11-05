/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize or reuse Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

export const DRIVE_SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.readonly'
];

/**
 * Creates a fresh GoogleAuthProvider with full Drive scopes and forces the consent screen.
 * `prompt: 'consent select_account'` ensures Google always prompts the user to grant
 * the required Google Drive permission checkboxes rather than silently reusing an unconsented token.
 */
export const createDriveProvider = (): GoogleAuthProvider => {
  const provider = new GoogleAuthProvider();
  DRIVE_SCOPES.forEach((scope) => provider.addScope(scope));
  provider.setCustomParameters({
    prompt: 'consent select_account',
    access_type: 'offline'
  });
  return provider;
};

// In-memory token storage (Do NOT store in localStorage per security guidelines)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const initDriveAuth = (
  onSuccess?: (user: User, token: string) => void,
  onFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onSuccess) onSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // Token not in memory yet (e.g. initial load or expired)
        if (onFailure) onFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onFailure) onFailure();
    }
  });
};

export const signInWithGoogleDrive = async (): Promise<{ user: User; accessToken: string }> => {
  try {
    isSigningIn = true;
    const provider = createDriveProvider();
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Google Drive access token was not returned.');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (err: any) {
    console.warn('Google Drive sign in notice:', err);

    // Provide clean, understandable feedback instead of raw stack traces
    if (err.code === 'auth/popup-closed-by-user') {
      const error = new Error('Sign-in window was closed before completing authorization. Click Connect to try again.');
      (error as any).code = 'POPUP_CLOSED';
      throw error;
    }
    if (err.code === 'auth/user-cancelled' || err.message?.includes('IdP denied access') || err.message?.includes('refuses to grant permission')) {
      const error = new Error('Google Drive permission was not granted. Please click Connect and check the permission box for Google Drive.');
      (error as any).code = 'PERMISSION_DENIED';
      throw error;
    }
    if (err.code === 'auth/popup-blocked') {
      const error = new Error('Sign-in popup was blocked by your browser. Please allow popups for this site and try again.');
      (error as any).code = 'POPUP_BLOCKED';
      throw error;
    }
    if (err.code === 'auth/cancelled-popup-request') {
      const error = new Error('A sign-in request is already in progress. Please complete or close the existing window.');
      (error as any).code = 'ALREADY_IN_PROGRESS';
      throw error;
    }

    throw err;
  } finally {
    isSigningIn = false;
  }
};

export const signOutGoogleDrive = async (): Promise<void> => {
  await signOut(auth);
  cachedAccessToken = null;
};

export const getDriveAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const clearDriveAccessToken = (): void => {
  cachedAccessToken = null;
};

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  webContentLink?: string;
  thumbnailLink?: string;
  size?: string;
  createdTime?: string;
  modifiedTime?: string;
  iconLink?: string;
}

export const fetchDriveFiles = async (
  folderId?: string,
  searchQuery?: string
): Promise<DriveFileItem[]> => {
  if (!cachedAccessToken) {
    const error = new Error('Google Drive authentication is required. Please connect your account.');
    (error as any).code = 'AUTH_REQUIRED';
    throw error;
  }

  let q = "trashed = false";
  if (folderId) {
    q += ` and '${folderId}' in parents`;
  }
  if (searchQuery && searchQuery.trim()) {
    q += ` and name contains '${searchQuery.trim().replace(/'/g, "\\'")}'`;
  }

  const fields = 'files(id, name, mimeType, webViewLink, webContentLink, thumbnailLink, size, createdTime, modifiedTime, iconLink)';
  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=${encodeURIComponent(fields)}&orderBy=folder,modifiedTime desc&pageSize=50`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${cachedAccessToken}`
    }
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    const rawMsg = errData?.error?.message || '';

    // Handle insufficient scopes / 403 explicitly
    if (
      response.status === 403 &&
      (rawMsg.toLowerCase().includes('scope') ||
        rawMsg.toLowerCase().includes('permission') ||
        rawMsg.toLowerCase().includes('access not configured'))
    ) {
      cachedAccessToken = null; // Invalidate current deficient token
      const error = new Error(
        'Google Drive access permission is required. Please click "Grant Drive Permissions" and check the permission box in Google.'
      );
      (error as any).code = 'INSUFFICIENT_SCOPES';
      throw error;
    }

    if (response.status === 401) {
      cachedAccessToken = null;
      const error = new Error('Your Google Drive session has expired. Please sign in again.');
      (error as any).code = 'AUTH_EXPIRED';
      throw error;
    }

    throw new Error(rawMsg || `Google Drive API error (${response.status})`);
  }

  const data = await response.json();
  return data.files || [];
};

export const uploadFileToDrive = async (
  file: File,
  folderId?: string
): Promise<DriveFileItem> => {
  if (!cachedAccessToken) {
    throw new Error('Google Drive authentication is required.');
  }

  const metadata: any = {
    name: file.name,
    mimeType: file.type || 'application/octet-stream'
  };
  if (folderId) {
    metadata.parents = [folderId];
  }

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const reader = new FileReader();
  const fileDataPromise = new Promise<ArrayBuffer>((resolve, reject) => {
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
  const fileBytes = await fileDataPromise;

  const metadataPart = `${delimiter}Content-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}`;
  const mediaHeader = `${delimiter}Content-Type: ${file.type || 'application/octet-stream'}\r\nContent-Transfer-Encoding: base64\r\n\r\n`;

  // Convert bytes to base64
  let binary = '';
  const bytes = new Uint8Array(fileBytes);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64Data = btoa(binary);

  const multipartRequestBody = metadataPart + mediaHeader + base64Data + closeDelimiter;

  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,webViewLink,webContentLink,size',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cachedAccessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`
      },
      body: multipartRequestBody
    }
  );

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `Failed to upload file to Google Drive (${response.status})`);
  }

  return response.json();
};

export const createDriveFolder = async (
  folderName: string,
  parentFolderId?: string
): Promise<DriveFileItem> => {
  if (!cachedAccessToken) {
    throw new Error('Google Drive authentication is required.');
  }

  const metadata: any = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder'
  };
  if (parentFolderId) {
    metadata.parents = [parentFolderId];
  }

  const response = await fetch('https://www.googleapis.com/drive/v3/files?fields=id,name,mimeType,webViewLink', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${cachedAccessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(metadata)
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || 'Failed to create folder in Google Drive.');
  }

  return response.json();
};

export const deleteDriveFile = async (fileId: string): Promise<boolean> => {
  if (!cachedAccessToken) {
    throw new Error('Google Drive authentication is required.');
  }

  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${cachedAccessToken}`
    }
  });

  if (!response.ok && response.status !== 204) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || 'Failed to delete file from Google Drive.');
  }

  return true;
};
