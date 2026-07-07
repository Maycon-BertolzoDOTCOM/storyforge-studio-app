'use client';

import React, { useState } from 'react';

const steps = [
  {
    id: 1,
    title: 'Prerequisites',
    description: 'Ensure you have the required tools installed',
    items: [
      { name: 'Docker', version: '24.0+', check: 'docker --version' },
      { name: 'Node.js', version: '20.0+', check: 'node --version' },
      { name: 'pnpm', version: '8.0+', check: 'pnpm --version' },
      { name: 'Python', version: '3.11+', check: 'python3 --version' },
    ],
  },
  {
    id: 2,
    title: 'Clone Repositories',
    description: 'Clone the StoryForge repositories',
    code: `# Clone the engine
git clone https://github.com/Maycon-BertolzoDOTCOM/storyforge-studio.git

# Clone the frontend (fork of OpenDesign)
git clone --depth 1 --filter=blob:none --sparse https://github.com/Maycon-BertolzoDOTCOM/storyforge-studio-app.git
cd storyforge-studio-app
git sparse-checkout set root apps/web packages/* tools/* scripts/*`,
  },
  {
    id: 3,
    title: 'Install Dependencies',
    description: 'Install dependencies for both projects',
    code: `# Engine dependencies
cd storyforge-studio/engine
pip install -r requirements.txt

# Frontend dependencies
cd ../storyforge-studio-app
pnpm install --ignore-scripts`,
  },
  {
    id: 4,
    title: 'Configure Environment',
    description: 'Set up your environment variables',
    code: `# Create .env file in engine directory
cp .env.example .env

# Edit .env with your API keys (optional for local dev)
# DEEPSEEK_API_KEY=your_key_here
# GOOGLE_AI_STUDIO_API_KEY=your_key_here`,
  },
  {
    id: 5,
    title: 'Start Services',
    description: 'Launch the StoryForge ecosystem',
    code: `# Start all services with Docker
cd storyforge-studio
docker-compose up -d

# Or start individually
docker-compose up engine-api billing-api mcp-server`,
  },
  {
    id: 6,
    title: 'Access the Atlas',
    description: 'Open the Feature Atlas in your browser',
    code: `# Open in browser
http://localhost:3000/atlas

# Or access specific sections
http://localhost:3000/atlas/api      # API Playground
http://localhost:3000/atlas/skills   # Skill Registry
http://localhost:3000/atlas/mcp      # MCP Inspector`,
  },
];

const services = [
  { name: 'Engine API', port: 8000, status: 'Required', description: 'Core Python backend' },
  { name: 'Billing API', port: 8001, status: 'Optional', description: 'Payment processing' },
  { name: 'Ingestion API', port: 8002, status: 'Optional', description: 'Content processing' },
  { name: 'MCP Server', port: 8003, status: 'Required', description: 'MCP protocol server' },
  { name: 'Web Frontend', port: 3000, status: 'Required', description: 'Next.js application' },
];

export default function DeployPage() {
  const [expandedStep, setExpandedStep] = useState<number | null>(1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">📚 Deployment Guide</h1>
          <p className="text-xl text-blue-100">
            Get the StoryForge ecosystem running on your machine
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Services Overview */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Services</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Service</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Port</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Description</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.name} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-900">{service.name}</td>
                    <td className="py-3 px-4">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">{service.port}</code>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          service.status === 'Required'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {service.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{service.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step) => (
            <div
              key={step.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {step.id}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                    <p className="text-gray-500">{step.description}</p>
                  </div>
                </div>
                <span className="text-gray-400">
                  {expandedStep === step.id ? '▲' : '▼'}
                </span>
              </button>

              {expandedStep === step.id && (
                <div className="px-6 pb-6">
                  {step.items && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      {step.items.map((item) => (
                        <div key={item.name} className="bg-gray-50 rounded-lg p-4">
                          <div className="font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.version}</div>
                          <code className="text-xs text-gray-400 mt-1 block">{item.check}</code>
                        </div>
                      ))}
                    </div>
                  )}
                  {step.code && (
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                      {step.code}
                    </pre>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Troubleshooting */}
        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🔧 Troubleshooting</h2>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Port already in use</h3>
              <code className="text-sm text-gray-600 block">
                lsof -i :8000 | grep LISTEN
              </code>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Docker not starting</h3>
              <code className="text-sm text-gray-600 block">
                sudo systemctl restart docker
              </code>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Check service health</h3>
              <code className="text-sm text-gray-600 block">
                curl http://localhost:8000/health
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
