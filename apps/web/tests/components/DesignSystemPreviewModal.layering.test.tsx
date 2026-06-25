// @vitest-environment jsdom

import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { DesignSystemPreviewModal } from '../../src/components/DesignSystemPreviewModal';
import { I18nProvider } from '../../src/i18n';
import type { DesignSystemSummary } from '../../src/types';

vi.mock('../../src/providers/registry', () => ({
  designSystemStaticUrl: (id: string, filePath: string) => `/design-systems/${id}/${filePath}`,
  fetchDesignSystem: vi.fn(async () => ({
    id: 'claymorphism',
    title: 'Claymorphism',
    summary: 'Bundled design system',
    category: 'style',
    body: '# Claymorphism',
  })),
  fetchProjectFileText: vi.fn(async () => null),
  openExternalUrl: vi.fn(),
  projectRawUrl: (projectId: string, filePath: string) => `/raw/${projectId}/${filePath}`,
}));

const SYSTEM = {
  id: 'claymorphism',
  title: 'Claymorphism',
  summary: 'Bundled design system',
  category: 'style',
  source: 'built-in',
} as DesignSystemSummary;

function renderInsideStackingContext() {
  const host = document.createElement('div');
  host.className = 'composer';
  document.body.appendChild(host);

  render(
    <I18nProvider>
      <div className="composer-shell">
        <DesignSystemPreviewModal system={SYSTEM} onClose={() => {}} />
      </div>
    </I18nProvider>,
    { container: host },
  );

  return host;
}

describe('DesignSystemPreviewModal layering', () => {
  afterEach(() => {
    cleanup();
    document.body.innerHTML = '';
  });

  it('portals the preview to document.body so composer overlays cannot cover it', () => {
    const host = renderInsideStackingContext();

    const backdrop = document.body.querySelector('.ds-modal-backdrop');
    expect(backdrop).toBeTruthy();
    expect(backdrop?.parentElement).toBe(document.body);
    expect(host.querySelector('.ds-modal-backdrop')).toBeNull();
  });
});
