'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { vivifyApi, Product } from '@/lib/vivify-api';

export default function VivifyPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const result = await vivifyApi.listProducts();
    if (result.success && result.data) {
      setProducts(result.data.products);
    } else {
      setError('Failed to load products');
    }
    setLoading(false);
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    
    const result = await vivifyApi.deleteProduct(id);
    if (result.success) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      {/* Header */}
      <div className="bg-black/20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <span className="text-4xl">💎</span>
                Vivify
              </h1>
              <p className="text-gray-400 mt-1">Product catalog with 3D Gaussian Splat viewers</p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/vivify/upload"
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-blue-700 transition-all"
              >
                📸 Upload Images
              </Link>
              <Link
                href="/vivify/new"
                className="px-6 py-2 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all"
              >
                + Manual Create
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-400">Loading products...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400 text-lg">{error}</p>
            <button
              onClick={fetchProducts}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Retry
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-white mb-2">No products yet</h2>
            <p className="text-gray-400 mb-6">Create your first product with 3D viewer</p>
            <Link
              href="/vivify/new"
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-blue-700 transition-all"
            >
              Create Product
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-white/30 transition-all"
              >
                {/* Product Image */}
                <div className="h-48 bg-gradient-to-br from-purple-900/50 to-blue-900/50 flex items-center justify-center">
                  {product.has_3d ? (
                    <div className="text-center">
                      <span className="text-5xl">🎯</span>
                      <p className="text-purple-300 text-sm mt-2">3D Ready</p>
                    </div>
                  ) : product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-5xl">📦</span>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-white">{product.name}</h3>
                    <span className="text-sm text-gray-400">{product.category || 'N/A'span>
                  </div>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-purple-400">
                      R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <div className="flex gap-2">
                      <Link
                        href={`/vivify/${product.id}`}
                        className="px-3 py-1 bg-white/10 text-white text-sm rounded-lg hover:bg-white/20 transition-colors"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="px-3 py-1 bg-red-500/20 text-red-400 text-sm rounded-lg hover:bg-red-500/30 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
