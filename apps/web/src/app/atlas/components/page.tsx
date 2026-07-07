'use client';

import React, { useState } from 'react';

interface Component {
  name: string;
  category: string;
  description: string;
  props: Prop[];
  variants: string[];
}

interface Prop {
  name: string;
  type: string;
  default?: string;
  description: string;
}

const components: Component[] = [
  {
    name: 'Button',
    category: 'Forms',
    description: 'A clickable button component',
    props: [
      { name: 'variant', type: 'string', default: 'primary', description: 'Button style variant' },
      { name: 'size', type: 'string', default: 'md', description: 'Button size' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the button' },
    ],
    variants: ['primary', 'secondary', 'danger', 'ghost'],
  },
  {
    name: 'Card',
    category: 'Layout',
    description: 'A container component',
    props: [
      { name: 'padding', type: 'string', default: 'md', description: 'Inner padding' },
      { name: 'shadow', type: 'string', default: 'sm', description: 'Box shadow' },
    ],
    variants: ['default', 'outlined', 'elevated'],
  },
  {
    name: 'Input',
    category: 'Forms',
    description: 'Text input field',
    props: [
      { name: 'placeholder', type: 'string', description: 'Placeholder text' },
      { name: 'error', type: 'boolean', default: 'false', description: 'Error state' },
    ],
    variants: ['default', 'error', 'disabled'],
  },
  {
    name: 'Modal',
    category: 'Overlay',
    description: 'Dialog overlay',
    props: [
      { name: 'open', type: 'boolean', description: 'Is modal open' },
      { name: 'title', type: 'string', description: 'Modal title' },
    ],
    variants: ['default', 'fullscreen'],
  },
  {
    name: 'Badge',
    category: 'Data Display',
    description: 'Status indicator',
    props: [
      { name: 'variant', type: 'string', default: 'default', description: 'Badge style' },
    ],
    variants: ['default', 'success', 'warning', 'error'],
  },
];

const categories = [...new Set(components.map((c) => c.category))];

export default function ComponentsPage() {
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [props, setProps] = useState<Record<string, any>>({});

  const filteredComponents = selectedCategory
    ? components.filter((c) => c.category === selectedCategory)
    : components;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🎨 UI Component Library</h1>
        <p className="text-gray-600">
          Explore and test all visual components from StoryForge
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            !selectedCategory
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Components List */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="font-semibold text-gray-900 mb-4">Components</h2>
          <div className="space-y-2">
            {filteredComponents.map((component) => (
              <button
                key={component.name}
                onClick={() => {
                  setSelectedComponent(component);
                  setProps({});
                }}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selectedComponent?.name === component.name
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-gray-900">{component.name}</div>
                <div className="text-sm text-gray-500">{component.category}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Component Preview */}
        <div className="lg:col-span-2 space-y-6">
          {selectedComponent ? (
            <>
              {/* Preview */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="font-semibold text-gray-900 mb-4">Preview</h2>
                <div className="bg-gray-50 rounded-lg p-8 flex items-center justify-center min-h-[200px]">
                  <div className="text-center text-gray-400">
                    <div className="text-4xl mb-2">🎨</div>
                    <div>Component Preview</div>
                    <div className="text-sm">Interactive demo coming soon</div>
                  </div>
                </div>
              </div>

              {/* Props */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Props</h3>
                <div className="space-y-3">
                  {selectedComponent.props.map((prop) => (
                    <div key={prop.name} className="flex items-center gap-4">
                      <label className="w-24 text-sm font-medium text-gray-700">{prop.name}</label>
                      <input
                        type="text"
                        placeholder={prop.default || prop.type}
                        value={props[prop.name] || ''}
                        onChange={(e) => setProps({ ...props, [prop.name]: e.target.value })}
                        className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <span className="text-xs text-gray-400">{prop.type}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Variants */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Variants</h3>
                <div className="flex gap-2">
                  {selectedComponent.variants.map((variant) => (
                    <span
                      key={variant}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm"
                    >
                      {variant}
                    </span>
                  ))}
                </div>
              </div>

              {/* Code Example */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Usage</h3>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto text-sm">
{`<${selectedComponent.name}${
  Object.entries(props)
    .map(([key, value]) => ` ${key}="${value}"`)
    .join('')
} />`}
                </pre>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
              Select a component to view preview and props
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
