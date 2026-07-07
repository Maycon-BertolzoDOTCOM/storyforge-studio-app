'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/atlas', label: 'Overview', icon: '🏠' },
  { href: '/atlas/components', label: 'UI Components', icon: '🎨' },
  { href: '/atlas/api', label: 'API Playground', icon: '🔌' },
  { href: '/atlas/skills', label: 'Skill Registry', icon: '🤖' },
  { href: '/atlas/mcp', label: 'MCP Inspector', icon: '🔧' },
  { href: '/atlas/metrics', label: 'Token Metrics', icon: '📊' },
];

export default function AtlasLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <Link href="/atlas" className="flex items-center gap-2">
            <span className="text-2xl">🗺️</span>
            <div>
              <h1 className="font-bold text-gray-900">Feature Atlas</h1>
              <p className="text-xs text-gray-500">StoryForge Ecosystem</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 space-y-1">
            <p>Engine API: <span className="text-green-600">localhost:8000</span></p>
            <p>MCP Server: <span className="text-green-600">localhost:8003</span></p>
            <p>Refly: <span className="text-gray-400">localhost:5700</span></p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
