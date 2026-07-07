'use client';

import React from 'react';
import Link from 'next/link';

const features = [
  {
    id: 'components',
    title: 'UI Component Library',
    description: 'Explore and test all visual components from OpenDesign and StoryForge',
    icon: '🎨',
    href: '/atlas/components',
    status: 'available',
    stats: { items: 45, stories: 23 },
  },
  {
    id: 'api',
    title: 'API Playground',
    description: 'Interactive documentation and testing for all Engine APIs',
    icon: '🔌',
    href: '/atlas/api',
    status: 'available',
    stats: { endpoints: 12, schemas: 8 },
  },
  {
    id: 'skills',
    title: 'Skill Registry',
    description: 'Browse and execute Refly skills for automation workflows',
    icon: '🤖',
    href: '/atlas/skills',
    status: 'available',
    stats: { skills: 11, workflows: 3 },
  },
  {
    id: 'mcp',
    title: 'MCP Tool Inspector',
    description: 'Inspect tools and resources from all MCP servers',
    icon: '🔧',
    href: '/atlas/mcp',
    status: 'available',
    stats: { servers: 3, tools: 16 },
  },
];

const quickActions = [
  {
    label: 'Test Landing Page Generator',
    description: 'Generate a landing page from product data',
    icon: '🚀',
    href: '/atlas/skills?skill=generate-landing-page',
  },
  {
    label: 'Scrape a Website',
    description: 'Extract data from any URL',
    icon: '🕷️',
    href: '/atlas/api?endpoint=scrape',
  },
  {
    label: 'View Figma Tools',
    description: 'See available Figma MCP tools',
    icon: 'igma',
    href: '/atlas/mcp?server=figma',
  },
];

export default function AtlasPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🗺️ StoryForge Feature Atlas
        </h1>
        <p className="text-gray-600">
          Your interactive guide to the entire StoryForge ecosystem
        </p>
      </div>

      {/* Status Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-1">Ecosystem Status</h2>
            <p className="text-blue-100">All systems operational</p>
          </div>
          <div className="flex gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold">4</div>
              <div className="text-xs text-blue-100">Services</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">11</div>
              <div className="text-xs text-blue-100">Skills</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">16</div>
              <div className="text-xs text-blue-100">MCP Tools</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {features.map((feature) => (
          <Link
            key={feature.id}
            href={feature.href}
            className="block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{feature.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-gray-500">{feature.description}</p>
                </div>
              </div>
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                {feature.status}
              </span>
            </div>
            <div className="flex gap-4 text-sm text-gray-600">
              {Object.entries(feature.stats).map(([key, value]) => (
                <div key={key}>
                  <span className="font-medium">{value}</span> {key}
                </div>
              ))}
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <span className="text-2xl">{action.icon}</span>
              <div>
                <div className="font-medium text-gray-900">{action.label}</div>
                <div className="text-sm text-gray-500">{action.description}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
