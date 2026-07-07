'use client';

import React, { useState, useEffect } from 'react';

interface Skill {
  name: string;
  displayName: string;
  description: string;
  category: string;
  inputSchema: any;
  outputSchema: any;
}

interface Workflow {
  name: string;
  displayName: string;
  description: string;
  steps: any[];
}

const localSkills: Skill[] = [
  {
    name: 'generate-landing-page',
    displayName: 'Generate Landing Page',
    description: 'Gera uma landing page completa a partir de dados do produto',
    category: 'storyforge',
    inputSchema: {
      type: 'object',
      properties: {
        product_name: { type: 'string' },
        features: { type: 'array', items: { type: 'string' } },
        images: { type: 'array', items: { type: 'string' } },
      },
    },
    outputSchema: { type: 'object', properties: { html_url: { type: 'string' } } },
  },
  {
    name: 'scrape-product',
    displayName: 'Scrape Product',
    description: 'Extrai dados de um produto de um site de e-commerce',
    category: 'ingestion',
    inputSchema: {
      type: 'object',
      properties: {
        url: { type: 'string' },
      },
    },
    outputSchema: { type: 'object', properties: { product_data: { type: 'object' } } },
  },
  {
    name: 'figma-to-code',
    displayName: 'Figma to Code',
    description: 'Converte um design do Figma em código React/HTML',
    category: 'figma',
    inputSchema: {
      type: 'object',
      properties: {
        file_key: { type: 'string' },
        node_id: { type: 'string' },
      },
    },
    outputSchema: { type: 'object', properties: { code: { type: 'string' } } },
  },
  {
    name: 'analyze-competitor',
    displayName: 'Analyze Competitor',
    description: 'Analisa a presença online de um concorrente',
    category: 'data',
    inputSchema: {
      type: 'object',
      properties: {
        company_name: { type: 'string' },
        website_url: { type: 'string' },
      },
    },
    outputSchema: { type: 'object', properties: { analysis: { type: 'object' } } },
  },
  {
    name: 'generate-video-script',
    displayName: 'Generate Video Script',
    description: 'Gera um roteiro para vídeo marketing',
    category: 'storyforge',
    inputSchema: {
      type: 'object',
      properties: {
        product: { type: 'string' },
        duration: { type: 'number' },
        style: { type: 'string' },
      },
    },
    outputSchema: { type: 'object', properties: { script: { type: 'string' } } },
  },
];

const localWorkflows: Workflow[] = [
  {
    name: 'video-to-website',
    displayName: 'Video to Website',
    description: 'Transforma um vídeo em uma landing page completa',
    steps: [
      { name: 'extract-audio', tool: 'extract_audio' },
      { name: 'transcribe', tool: 'transcribe' },
      { name: 'generate-script', tool: 'generate_script' },
      { name: 'generate-landing', tool: 'generate_landing' },
    ],
  },
  {
    name: 'figma-to-code',
    displayName: 'Figma to Code',
    description: 'Converte um design do Figma em código funcional',
    steps: [
      { name: 'get-figma-data', tool: 'get_figma_data' },
      { name: 'generate-components', tool: 'generate_components' },
      { name: 'apply-styles', tool: 'apply_styles' },
    ],
  },
  {
    name: 'analyze-competitor',
    displayName: 'Analyze Competitor',
    description: 'Análise completa de um concorrente',
    steps: [
      { name: 'scrape-website', tool: 'scrape_website' },
      { name: 'analyze-seo', tool: 'analyze_seo' },
      { name: 'generate-report', tool: 'generate_report' },
    ],
  },
];

const categoryColors: Record<string, string> = {
  storyforge: 'bg-blue-100 text-blue-700',
  ingestion: 'bg-green-100 text-green-700',
  figma: 'bg-purple-100 text-purple-700',
  data: 'bg-yellow-100 text-yellow-700',
  materialview: 'bg-red-100 text-red-700',
  admin: 'bg-gray-100 text-gray-700',
};

export default function SkillsPage() {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [inputValues, setInputValues] = useState<Record<string, any>>({});
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'skills' | 'workflows'>('skills');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSkills = localSkills.filter(
    (skill) =>
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExecute = async () => {
    if (!selectedSkill) return;

    // Mock execution
    setExecutionResult({
      success: true,
      output: { message: `Executed ${selectedSkill.name} successfully` },
      duration: Math.random() * 1000,
    });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🤖 Skill Registry</h1>
        <p className="text-gray-600">
          Browse and execute Refly skills for automation workflows
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('skills')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'skills'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Skills ({localSkills.length})
        </button>
        <button
          onClick={() => setActiveTab('workflows')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'workflows'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Workflows ({localWorkflows.length})
        </button>
      </div>

      {activeTab === 'skills' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Skills List */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="space-y-2">
              {filteredSkills.map((skill) => (
                <button
                  key={skill.name}
                  onClick={() => {
                    setSelectedSkill(skill);
                    setInputValues({});
                    setExecutionResult(null);
                  }}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedSkill?.name === skill.name
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded ${
                        categoryColors[skill.category] || 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {skill.category}
                    </span>
                  </div>
                  <div className="font-medium text-gray-900">{skill.displayName}</div>
                  <div className="text-sm text-gray-500">{skill.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Skill Detail */}
          <div className="lg:col-span-2 space-y-6">
            {selectedSkill ? (
              <>
                {/* Skill Info */}
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {selectedSkill.displayName}
                      </h2>
                      <p className="text-gray-500">{selectedSkill.description}</p>
                    </div>
                    <button
                      onClick={handleExecute}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      ▶ Execute
                    </button>
                  </div>

                  {/* Input Schema */}
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Input Schema</h3>
                    <pre className="bg-gray-50 p-3 rounded-lg text-sm font-mono overflow-auto">
                      {JSON.stringify(selectedSkill.inputSchema, null, 2)}
                    </pre>
                  </div>

                  {/* Output Schema */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Output Schema</h3>
                    <pre className="bg-gray-50 p-3 rounded-lg text-sm font-mono overflow-auto">
                      {JSON.stringify(selectedSkill.outputSchema, null, 2)}
                    </pre>
                  </div>
                </div>

                {/* Input Form */}
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Test Input</h3>
                  <div className="space-y-4">
                    {selectedSkill.inputSchema.properties &&
                      Object.entries(selectedSkill.inputSchema.properties).map(
                        ([key, schema]: [string, any]) => (
                          <div key={key}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {key}
                              {selectedSkill.inputSchema.required?.includes(key) && (
                                <span className="text-red-500 ml-1">*</span>
                              )}
                            </label>
                            <input
                              type="text"
                              placeholder={schema.type}
                              value={inputValues[key] || ''}
                              onChange={(e) =>
                                setInputValues({ ...inputValues, [key]: e.target.value })
                              }
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        )
                      )}
                  </div>
                </div>

                {/* Execution Result */}
                {executionResult && (
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Result</h3>
                    <pre className="bg-gray-50 p-4 rounded-lg overflow-auto max-h-64 text-sm font-mono">
                      {JSON.stringify(executionResult, null, 2)}
                    </pre>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
                Select a skill to view details and test
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Workflows Tab */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {localWorkflows.map((workflow) => (
            <div
              key={workflow.name}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >
              <h3 className="font-semibold text-gray-900 mb-2">{workflow.displayName}</h3>
              <p className="text-sm text-gray-500 mb-4">{workflow.description}</p>
              <div className="space-y-2">
                {workflow.steps.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span className="w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{step.name}</span>
                    <span className="text-gray-400">→</span>
                    <code className="text-xs bg-gray-100 px-1 rounded">{step.tool}</code>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
