'use client';

import React from 'react';
import Link from 'next/link';

const products = [
  {
    name: 'StoryForge',
    tagline: 'Create stunning presentations and marketing content',
    description: 'AI-powered platform for generating landing pages, video scripts, and marketing materials from product data.',
    icon: '🔥',
    color: 'from-orange-500 to-red-600',
    href: '/atlas',
    features: ['Landing Page Generator', 'Video Script Creator', 'AI Content Generation'],
  },
  {
    name: 'MaterialView-Pro',
    tagline: 'Simulate and visualize premium materials',
    description: 'Advanced material simulation engine for realistic product visualization and rendering.',
    icon: '💎',
    color: 'from-blue-500 to-purple-600',
    href: '/atlas/skills?skill=simulate-material',
    features: ['Material Simulation', 'Real-time Rendering', 'Physics-based Effects'],
  },
  {
    name: 'Vivify',
    tagline: 'Manage your premium product ecosystem',
    description: 'Business management platform for inventory, billing, and customer relationships.',
    icon: '📊',
    color: 'from-green-500 to-teal-600',
    href: '/atlas/api?endpoint=billing',
    features: ['Inventory Management', 'Billing System', 'Customer Portal'],
  },
];

const stats = [
  { label: 'Skills', value: '11', icon: '🤖' },
  { label: 'Workflows', value: '3', icon: '⚡' },
  { label: 'MCP Tools', value: '16', icon: '🔧' },
  { label: 'API Endpoints', value: '12', icon: '🔌' },
];

const quickStart = [
  {
    step: 1,
    title: 'Start the Engine',
    description: 'Launch the Python backend with Docker',
    code: 'docker-compose up engine-api',
  },
  {
    step: 2,
    title: 'Access the Atlas',
    description: 'Open the Feature Atlas in your browser',
    code: 'http://localhost:3000/atlas',
  },
  {
    step: 3,
    title: 'Test a Skill',
    description: 'Try generating a landing page',
    code: 'POST /api/generate {"prompt": "..."}',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <span className="text-6xl">🔥</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              StoryForge <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Ecosystem</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              A unified platform for creating, simulating, and managing premium product experiences.
              Powered by AI, designed for excellence.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/atlas"
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-red-700 transition-all transform hover:scale-105"
              >
                Explore Feature Atlas
              </Link>
              <Link
                href="/deploy"
                className="px-8 py-3 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-all"
              >
                Deployment Guide
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Three Products, One Ecosystem</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              From material simulation to marketing content to business management.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product) => (
              <Link
                key={product.name}
                href={product.href}
                className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/30 transition-all hover:transform hover:scale-105"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${product.color} flex items-center justify-center text-3xl mb-6`}>
                  {product.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{product.name}</h3>
                <p className="text-orange-400 font-medium mb-3">{product.tagline}</p>
                <p className="text-gray-400 mb-6">{product.description}</p>
                <div className="space-y-2">
                  {product.features.map((feature) => (
                    <div key={feature} className="flex items-center text-sm text-gray-300">
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2" />
                      {feature}
                    </div>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Start Section */}
      <div className="py-24 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Quick Start</h2>
            <p className="text-gray-400">Get up and running in minutes</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {quickStart.map((item) => (
              <div key={item.step} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 mb-4">{item.description}</p>
                <code className="block bg-black/50 rounded-lg p-3 text-sm text-green-400 font-mono">
                  {item.code}
                </code>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Architecture Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Architecture</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Built with modern technologies for scalability and performance
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Frontend</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-300">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                    Next.js 14 with App Router
                  </div>
                  <div className="flex items-center text-gray-300">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                    TypeScript for type safety
                  </div>
                  <div className="flex items-center text-gray-300">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                    Tailwind CSS for styling
                  </div>
                  <div className="flex items-center text-gray-300">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                    React Query for data fetching
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Backend</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-300">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                    Python FastAPI
                  </div>
                  <div className="flex items-center text-gray-300">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                    SQLite + SQLAlchemy
                  </div>
                  <div className="flex items-center text-gray-300">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                    Docker containerization
                  </div>
                  <div className="flex items-center text-gray-300">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                    MCP protocol integration
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-r from-orange-600 to-red-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Build?</h2>
          <p className="text-orange-100 mb-8">
            Start creating amazing product experiences today.
          </p>
          <Link
            href="/atlas"
            className="inline-block px-8 py-3 bg-white text-orange-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Launch Feature Atlas →
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <span className="text-2xl">🔥</span>
              <span className="text-white font-bold">StoryForge</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2026 StoryForge Ecosystem. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
