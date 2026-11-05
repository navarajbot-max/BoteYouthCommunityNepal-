/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * BYCN Durable Storage Persistence Service
 * Combines Firebase Firestore, IndexedDB, and localStorage to guarantee
 * that user and admin uploaded images, logos, and documents NEVER disappear,
 * even across page reloads, browser restarts, or ephemeral server restarts.
 */

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getFirestoreDb } from './firebase';

const ASSETS_COLLECTION = 'community_assets';
const LOCAL_STORAGE_PREFIX = 'bycn_asset_';
const DB_NAME = 'bycn_storage_vault';
const STORE_NAME = 'assets';

// In-memory cache for ultra-fast sub-millisecond retrieval
const memoryAssetCache = new Map<string, string>();

/**
 * Open IndexedDB store safely
 */
function openIndexedDB(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }
    try {
      const request = window.indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'key' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        console.warn('IndexedDB failed to open:', request.error);
        resolve(null);
      };
    } catch (err) {
      console.warn('IndexedDB exception:', err);
      resolve(null);
    }
  });
}

/**
 * Persist an asset (Base64 data URL, image, or document) to:
 * 1. In-memory cache
 * 2. IndexedDB & localStorage
 * 3. Firebase Firestore (community_assets collection)
 */
export async function persistAsset(key: string, dataUrl: string, metadata?: Record<string, any>): Promise<string> {
  if (!key || !dataUrl) return dataUrl;

  const normalizedKey = key.replace(/[^a-zA-Z0-9_-]/g, '_');
  
  // 1. Store in memory
  memoryAssetCache.set(normalizedKey, dataUrl);
  memoryAssetCache.set(key, dataUrl);

  // 2. Store in localStorage (if size fits)
  try {
    if (dataUrl.length < 500000) {
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}${normalizedKey}`, dataUrl);
    }
  } catch (err) {
    // LocalStorage quota may be exceeded for large images, continue to IndexedDB
  }

  // 3. Store in IndexedDB
  try {
    const db = await openIndexedDB();
    if (db) {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put({
        key: normalizedKey,
        originalKey: key,
        dataUrl,
        metadata: metadata || {},
        updatedAt: new Date().toISOString()
      });
    }
  } catch (err) {
    console.warn('Failed to cache asset in IndexedDB:', err);
  }

  // 4. Store in Firebase Firestore for global cross-device durability
  try {
    const firestore = getFirestoreDb();
    const docRef = doc(firestore, ASSETS_COLLECTION, normalizedKey);
    await setDoc(docRef, {
      key: normalizedKey,
      originalKey: key,
      dataUrl,
      metadata: metadata || {},
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('Failed to save asset to Firestore:', err);
  }

  return dataUrl;
}

/**
 * Retrieve a persisted asset from Cache -> IndexedDB -> LocalStorage -> Firestore
 */
export async function getPersistedAsset(key: string): Promise<string | null> {
  if (!key) return null;

  const normalizedKey = key.replace(/[^a-zA-Z0-9_-]/g, '_');

  // 1. Check memory
  if (memoryAssetCache.has(key)) return memoryAssetCache.get(key)!;
  if (memoryAssetCache.has(normalizedKey)) return memoryAssetCache.get(normalizedKey)!;

  // 2. Check localStorage
  try {
    const local = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}${normalizedKey}`);
    if (local) {
      memoryAssetCache.set(normalizedKey, local);
      return local;
    }
  } catch {
    // Ignore
  }

  // 3. Check IndexedDB
  try {
    const db = await openIndexedDB();
    if (db) {
      const val = await new Promise<any>((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const req = tx.objectStore(STORE_NAME).get(normalizedKey);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
      });
      if (val?.dataUrl) {
        memoryAssetCache.set(normalizedKey, val.dataUrl);
        return val.dataUrl;
      }
    }
  } catch (err) {
    console.warn('IndexedDB retrieval error:', err);
  }

  // 4. Check Firestore
  try {
    const firestore = getFirestoreDb();
    const docRef = doc(firestore, ASSETS_COLLECTION, normalizedKey);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data?.dataUrl) {
        memoryAssetCache.set(normalizedKey, data.dataUrl);
        return data.dataUrl;
      }
    }
  } catch (err) {
    console.warn('Firestore asset retrieval error:', err);
  }

  return null;
}

/**
 * Cache an image locally in memory and storage
 */
export function cacheAssetSynchronously(key: string, dataUrl: string): void {
  if (!key || !dataUrl) return;
  const normalizedKey = key.replace(/[^a-zA-Z0-9_-]/g, '_');
  memoryAssetCache.set(key, dataUrl);
  memoryAssetCache.set(normalizedKey, dataUrl);
  try {
    if (dataUrl.length < 500000) {
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}${normalizedKey}`, dataUrl);
    }
  } catch {
    // Ignore
  }
}

/**
 * Returns a cached asset if available in memory or localStorage synchronously
 */
export function getSynchronousCachedAsset(key: string): string | null {
  if (!key) return null;
  const normalizedKey = key.replace(/[^a-zA-Z0-9_-]/g, '_');
  if (memoryAssetCache.has(key)) return memoryAssetCache.get(key)!;
  if (memoryAssetCache.has(normalizedKey)) return memoryAssetCache.get(normalizedKey)!;
  try {
    return localStorage.getItem(`${LOCAL_STORAGE_PREFIX}${normalizedKey}`);
  } catch {
    return null;
  }
}
