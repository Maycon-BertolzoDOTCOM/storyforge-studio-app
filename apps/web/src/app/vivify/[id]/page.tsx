'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { vivifyApi, Product } from '@/lib/vivify-api';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [viewerHtml, setViewerHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [deployUrl, setDeployUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const productId = params.id as string;

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    const result = await vivifyApi.getProduct(productId);
    if (result.success && result.data) {
      setProduct(result.data.product);
      setDeployUrl(result.data.product.landing_page_url || null);
      
      // Fetch viewer HTML if product has 3D
      if (result.data.product.has_3d) {
        const viewerResult = await vivifyApi.getViewerHtml(productId, '500px');
        if (viewerResult.success && viewerResult.data) {
          setViewerHtml(viewerResult.data.viewer_html);
        }
      }
    } else {
      setError('Failed to load product');
    }
    setLoading(false);
  };

  const generateLanding = async () => {
    setGenerating(true);
    const result = await vivifyApi.generateLanding(productId);
    if (result.success && result.data) {
      // Download the HTML
      const blob = new Blob([result.data.landing_page_html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${product?.name || 'landing'}.html`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      alert('Failed to generate landing page');
    }
    setGenerating(false);
  };

  const deployLanding = async () => {
    setDeploying(true);
    const result = await vivifyApi.deployLanding(productId, { provider: 'netlify' });
    if (result.success && result.data) {
      setDeployUrl(result.data.url);
    } else {
      alert(result.error || 'Failed to deploy');
    }
    setDeploying(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-400">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">{error || 'Product not found'}</p>
          <Link href="/vivify" className="text-purple-400 hover:text-purple-300">
            ← Back to products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      {/* Header */}
      <div className="bg-black/20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/vivify"
              className="text-gray-400 hover:text-white transition-colors"
            >
              ← Back
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">{product.name}</h1>
              <p className="text-gray-400">{product.category || 'No category'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* 3D Viewer */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
            {product.has_3d && viewerHtml ? (
              <div dangerouslySetInnerHTML={{ __html: viewerHtml }} />
            ) : (
              <div className="h-[500px] flex items-center justify-center">
                <div className="text-center">
                  <span className="text-6xl mb-4 block">🎯</span>
                  <p className="text-gray-400 mb-4">No 3D viewer yet</p>
                  <p className="text-sm text-gray-500">
                    Upload product photos and generate a 3D Gaussian Splat
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Product Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm">Description</label>
                  <p className="text-white">{product.description || 'No description'}</p>
                </div>
                
                <div>
                  <label className="text-gray-400 text-sm">Price</label>
                  <p className="text-3xl font-bold text-purple-400">
                    R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                
                <div>
                  <label className="text-gray-400 text-sm">Status</label>
                  <p className="text-white capitalize">{product.status}</p>
                </div>
              </div>
            </div>

            {/* 3D Info */}
            {product.has_3d && (
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-purple-400">🎯</span> 3D Viewer
                </h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 text-sm">Splats</label>
                    <p className="text-white text-lg font-semibold">
                      {product.splat_splat_count?.toLocaleString() || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Quality</label>
                    <p className="text-white text-lg font-semibold">
                      {product.splat_quality_score || 'N/A'}/100
                    </p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">File Size</label>
                    <p className="text-white text-lg font-semibold">
                      {product.splat_file_size_mb?.toFixed(1) || 'N/A'} MB
                    </p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Status</label>
                    <p className="text-green-400 text-lg font-semibold">Ready</p>
                  </div>
                </div>
              </div>
            )}

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-blue-400">📦</span> Variants ({product.variants.length})
                </h2>
                
                <div className="space-y-3">
                  {product.variants.map((variant) => (
                    <div
                      key={variant.id}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                    >
                      <div>
                        <p className="text-white font-medium">{variant.name}</p>
                        <p className="text-gray-400 text-sm">SKU: {variant.sku}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-purple-400 font-semibold">
                          R$ {variant.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-gray-400 text-sm">Stock: {variant.stock}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Actions</h2>
              
              <div className="space-y-3">
                {product.has_3d && (
                  <>
                    <button
                      onClick={generateLanding}
                      disabled={generating}
                      className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-blue-700 transition-all disabled:opacity-50"
                    >
                      {generating ? 'Generating...' : 'Download Landing Page'}
                    </button>
                    
                    <button
                      onClick={deployLanding}
                      disabled={deploying}
                      className="w-full py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-teal-700 transition-all disabled:opacity-50"
                    >
                      {deploying ? 'Deploying...' : '🚀 Deploy to Netlify'}
                    </button>
                  </>
                )}
                
                <Link
                  href={`/vivify/${product.id}/edit`}
                  className="block w-full py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors text-center"
                >
                  Edit Product
                </Link>
              </div>
              
              {deployUrl && (
                <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                  <p className="text-green-400 text-sm">Deployed!</p>
                  <a
                    href={deployUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-300 text-sm underline"
                  >
                    {deployUrl}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
