'use client';

import React, { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { vivifyApi } from '@/lib/vivify-api';

interface UploadedFile {
  file: File;
  preview: string;
  status: 'pending' | 'uploading' | 'done' | 'error';
}

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [productName, setProductName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleFiles = useCallback((newFiles: FileList | File[]) => {
    const imageFiles = Array.from(newFiles).filter(f => 
      f.type.startsWith('image/')
    );
    
    const uploaded: UploadedFile[] = imageFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      status: 'pending' as const,
    }));
    
    setFiles(prev => [...prev, ...uploaded]);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files?.length) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const startGeneration = async () => {
    if (!productName) {
      setError('Product name is required');
      return;
    }
    
    if (files.length < 20) {
      setError('At least 20 images required for good 3D quality');
      return;
    }

    setGenerating(true);
    setProgress(0);
    setError(null);

    try {
      // Step 1: Create product
      const productResult = await vivifyApi.createProduct({
        name: productName,
        description: `Product with ${files.length} images`,
      });
      
      if (!productResult.success || !productResult.data) {
        throw new Error('Failed to create product');
      }

      const productId = productResult.data.product.id;
      setProgress(10);

      // Step 2: Upload images (simulated - in real app would upload to storage)
      // For now, we'll use local file paths
      setProgress(30);

      // Step 3: Generate splat (simulated - requires splat-transform CLI)
      // In production, this would call the actual splat generation endpoint
      setProgress(70);

      // Step 4: Associate splat with product
      const splatResult = await vivifyApi.uploadSplat(productId, {
        splat_url: `/data/splats/${productId}.ply`,
        splat_count: 150000,
        file_size_mb: 4.5,
        quality_score: 85,
      });

      setProgress(100);

      // Navigate to product page
      router.push(`/vivify/${productId}`);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      {/* Header */}
      <div className="bg-black/20 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/vivify"
              className="text-gray-400 hover:text-white transition-colors"
            >
              ← Back
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <span className="text-4xl">📸</span>
                Upload Product Images
              </h1>
              <p className="text-gray-400 mt-1">Upload 20+ images to generate a 3D Gaussian Splat viewer</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Name */}
        <div className="mb-6">
          <label className="block text-gray-400 text-sm mb-2">Product Name *</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            placeholder="e.g., Anel Celestial"
          />
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-white/30 rounded-2xl p-12 text-center cursor-pointer hover:border-purple-500 hover:bg-white/5 transition-all"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
            className="hidden"
          />
          
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Drop images here or click to browse
          </h3>
          <p className="text-gray-400">
            Supports JPG, PNG, WebP • Minimum 20 images recommended
          </p>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                {files.length} images selected
              </h3>
              <button
                onClick={() => {
                  files.forEach(f => URL.revokeObjectURL(f.preview));
                  setFiles([]);
                }}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                Clear all
              </button>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="relative aspect-square bg-white/5 rounded-lg overflow-hidden group"
                >
                  <img
                    src={file.preview}
                    alt={file.file.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1">
                    <p className="text-xs text-white truncate">{file.file.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Progress */}
        {generating && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white">Generating 3D model...</span>
              <span className="text-purple-400">{progress}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <Link
            href="/vivify"
            className="flex-1 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors text-center"
          >
            Cancel
          </Link>
          <button
            onClick={startGeneration}
            disabled={generating || files.length < 20 || !productName}
            className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? 'Generating...' : `Generate 3D Model (${files.length} images)`}
          </button>
        </div>

        {/* Tips */}
        <div className="mt-8 p-6 bg-white/5 rounded-2xl border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">📸 Photography Tips</h3>
          <ul className="space-y-2 text-gray-400">
            <li>• Use 50-100 images for best quality</li>
            <li>• Keep consistent lighting across all photos</li>
            <li>• Rotate the product 360° around the vertical axis</li>
            <li>• Include some close-up shots for detail</li>
            <li>• Use a plain background (white or black works best)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
