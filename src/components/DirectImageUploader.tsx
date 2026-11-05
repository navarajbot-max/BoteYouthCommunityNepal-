/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, Trash2, RefreshCw, CheckCircle2 } from 'lucide-react';
import { persistAsset, cacheAssetSynchronously, getSynchronousCachedAsset } from '../services/storagePersistence';
import { DEFAULT_LOGO_URL } from '../data/communityData';

interface DirectImageUploaderProps {
  id?: string;
  label: string;
  value: string;
  onChange: (imageUrl: string) => void;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'banner';
  hint?: string;
  className?: string;
}

/**
 * Optimizes and converts any uploaded image file to a base64 Data URL.
 * Automatically downscales oversized photos to prevent localStorage quota exhaustion
 * while retaining high visual fidelity.
 */
function processImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // Keep SVGs untouched to preserve vector quality
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const maxWidth = 1200;
        const maxHeight = 1200;
        let { width, height } = img;

        // If file is already compact, preserve raw data
        if (width <= maxWidth && height <= maxHeight && file.size < 250 * 1024) {
          resolve(event.target?.result as string);
          return;
        }

        // Scale down proportionally
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // For transparent PNGs keep PNG, otherwise use JPEG for efficient compression
        const outputFormat = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const compressedDataUrl = canvas.toDataURL(outputFormat, 0.85);
        resolve(compressedDataUrl);
      };
      img.onerror = () => resolve(event.target?.result as string);
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function DirectImageUploader({
  id = 'direct-image-uploader',
  label,
  value,
  onChange,
  aspectRatio = 'video',
  hint = 'Supports JPG, PNG, WEBP, or SVG. Click or drag & drop to upload.',
  className = ''
}: DirectImageUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPG, PNG, WEBP, or SVG).');
      return;
    }
    setErrorMessage(null);
    setIsProcessing(true);
    try {
      const dataUrl = await processImageFile(file);
      
      // 1. Instantly cache in memory and storage persistence vault
      const assetKey = `${label || 'image'}_${Date.now()}`;
      cacheAssetSynchronously(assetKey, dataUrl);
      persistAsset(assetKey, dataUrl, { label, filename: file.name }).catch((err) =>
        console.warn('Storage persistence background sync:', err)
      );

      // 2. Upload to server's disk storage and manifest
      let serverUrl: string | null = null;
      try {
        const uploadRes = await fetch('/api/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: dataUrl, category: label || 'image' })
        });
        if (uploadRes.ok) {
          const uploadJson = await uploadRes.json();
          if (uploadJson.success && uploadJson.url) {
            serverUrl = uploadJson.url;
            cacheAssetSynchronously(serverUrl, dataUrl);
            persistAsset(serverUrl, dataUrl, { label, filename: file.name }).catch((e) => console.warn(e));
          }
        }
      } catch (uploadErr) {
        console.warn('Server disk upload skipped, using fallback:', uploadErr);
      }

      // 3. Propagate resilient URL / dataUrl to parent component
      onChange(serverUrl || dataUrl);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to process image file. Please try another image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await handleFile(file);
    }
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFile(file);
    }
    // Reset file input value so re-uploading the same file works if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerBrowse = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleClear = () => {
    onChange('');
    setErrorMessage(null);
  };

  const aspectClass =
    aspectRatio === 'square'
      ? 'aspect-square max-w-[200px]'
      : aspectRatio === 'portrait'
      ? 'aspect-[3/4] max-w-[220px]'
      : aspectRatio === 'banner'
      ? 'aspect-[21/9] w-full max-h-48'
      : 'aspect-video w-full max-h-52';

  const safeValue = typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="block text-xs font-bold text-slate-700">
          {label}
        </label>
        {safeValue && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            <span>Image Attached</span>
          </span>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        id={id}
        accept="image/png, image/jpeg, image/webp, image/gif, image/svg+xml"
        onChange={onFileChange}
        className="hidden"
      />

      {/* Direct Upload Interface */}
      {safeValue ? (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 p-3 flex flex-col sm:flex-row items-center gap-4">
          <div className={`${aspectClass} overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm shrink-0 flex items-center justify-center`}>
            <img
              src={safeValue}
              alt={label}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                const cached = getSynchronousCachedAsset(safeValue);
                if (cached && target.src !== cached) {
                  target.src = cached;
                } else if (target.src !== DEFAULT_LOGO_URL) {
                  target.src = DEFAULT_LOGO_URL;
                }
              }}
            />
          </div>

          <div className="flex-1 space-y-2 text-center sm:text-left w-full">
            <div className="text-xs font-bold text-slate-800 flex items-center justify-center sm:justify-start gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
              <span>Current Uploaded Photo</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Directly stored in community database. You can replace it anytime with a new photo from your device.
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <button
                type="button"
                id={`${id}-replace-btn`}
                onClick={triggerBrowse}
                disabled={isProcessing}
                className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                <span>Replace Image</span>
              </button>
              <button
                type="button"
                id={`${id}-remove-btn`}
                onClick={handleClear}
                className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={triggerBrowse}
          className={`cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
            isDragOver
              ? 'border-red-500 bg-red-50/70 scale-[0.99]'
              : 'border-slate-300 bg-slate-50/70 hover:bg-slate-100/80 hover:border-slate-400'
          }`}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 group-hover:text-red-600">
              {isProcessing ? (
                <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
              ) : (
                <UploadCloud className="w-6 h-6 text-[#DC143C]" />
              )}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">
                {isProcessing ? 'Optimizing photo...' : 'Click to Browse or Drag & Drop Image'}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">{hint}</p>
            </div>
            <button
              type="button"
              id={`${id}-browse-btn`}
              className="mt-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-3.5 py-1 rounded-xl text-xs font-semibold shadow-xs"
            >
              Choose from Computer / Phone
            </button>
          </div>
        </div>
      )}

      {errorMessage && (
        <p className="text-xs font-semibold text-red-600 mt-1">{errorMessage}</p>
      )}
    </div>
  );
}
