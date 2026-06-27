import { Icon } from './Icon';
import { useState, type CSSProperties } from 'react';

type TemplateDemo = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  accent: string;
  meta: string;
  type: 'Prototype' | 'Slide' | 'Website' | 'Document' | 'Dashboard' | 'App';
  subtype: string;
};

const COMMUNITY_TEMPLATES: TemplateDemo[] = [
  {
    id: 'electric-studio',
    title: 'Electric Studio',
    description: 'A crisp agency deck starter with hero slide, capabilities, and brand-forward layout.',
    tags: ['Slide', 'Pitch deck', 'Brand'],
    accent: '#4164f4',
    meta: '7 slides · HTML',
    type: 'Slide',
    subtype: 'Pitch deck',
  },
  {
    id: 'launch-landing',
    title: 'Product Launch Landing',
    description: 'A polished launch page template with hero, feature proof, pricing, and FAQ sections.',
    tags: ['Website', 'Landing page'],
    accent: '#d46342',
    meta: '1 page · Responsive',
    type: 'Website',
    subtype: 'Landing page',
  },
  {
    id: 'founder-memo',
    title: 'Founder Memo',
    description: 'A narrative investor memo layout for market, product, traction, and ask.',
    tags: ['Document', 'Narrative'],
    accent: '#111827',
    meta: 'Long form · Editorial',
    type: 'Document',
    subtype: 'Narrative',
  },
  {
    id: 'growth-dashboard',
    title: 'Growth Dashboard',
    description: 'A compact metrics dashboard for acquisition, activation, usage, and revenue reviews.',
    tags: ['Dashboard', 'Analytics'],
    accent: '#0f9f6e',
    meta: 'Dashboard · KPI',
    type: 'Dashboard',
    subtype: 'Analytics',
  },
  { id: 'ai-product-site', title: 'AI Product Site', description: 'A polished SaaS website for AI tools with product proof and workflow sections.', tags: ['Website', 'AI', 'SaaS'], accent: '#7c3aed', meta: '5 sections · Responsive', type: 'Website', subtype: 'SaaS' },
  { id: 'commerce-home', title: 'Commerce Home', description: 'A retail homepage with campaign hero, category tiles, product rails, and offer blocks.', tags: ['Website', 'Commerce'], accent: '#ea580c', meta: 'Homepage · Storefront', type: 'Website', subtype: 'Commerce' },
  { id: 'mobile-app-launch', title: 'Mobile App Launch', description: 'Launch narrative for consumer apps with feature walkthrough and app-store CTAs.', tags: ['Website', 'Mobile'], accent: '#0284c7', meta: 'Landing · Mobile', type: 'Website', subtype: 'Landing page' },
  { id: 'portfolio-case-study', title: 'Portfolio Case Study', description: 'A designer case-study template with challenge, process, decisions, and outcomes.', tags: ['Portfolio', 'Editorial'], accent: '#111827', meta: 'Long form · Case study', type: 'Document', subtype: 'Case study' },
  { id: 'design-system-docs', title: 'Design System Docs', description: 'Documentation starter for tokens, components, examples, and contribution rules.', tags: ['Docs', 'Design system'], accent: '#4f46e5', meta: 'Docs · Components', type: 'Document', subtype: 'Docs' },
  { id: 'event-microsite', title: 'Event Microsite', description: 'Conference page with agenda, speakers, location, sponsors, and registration CTA.', tags: ['Website', 'Event'], accent: '#db2777', meta: '1 page · Event', type: 'Website', subtype: 'Event' },
  { id: 'agency-services', title: 'Agency Services', description: 'Service studio website with positioning, case modules, process, and inquiry form.', tags: ['Website', 'Agency'], accent: '#d46a3c', meta: 'Website · Studio', type: 'Website', subtype: 'Agency' },
  { id: 'fintech-dashboard', title: 'Fintech Dashboard', description: 'Finance dashboard shell with balance cards, risk states, charts, and activity feed.', tags: ['Dashboard', 'Fintech'], accent: '#16a34a', meta: 'Dashboard · Finance', type: 'Dashboard', subtype: 'Fintech' },
  { id: 'healthcare-intake', title: 'Healthcare Intake', description: 'Patient intake flow for symptoms, insurance, appointments, and care guidance.', tags: ['App', 'Healthcare'], accent: '#0f9f6e', meta: 'Flow · Form', type: 'Prototype', subtype: 'Healthcare' },
  { id: 'developer-docs', title: 'Developer Docs', description: 'Docs landing page with quickstart, API examples, status cards, and navigation.', tags: ['Docs', 'Developer'], accent: '#475569', meta: 'Docs · API', type: 'Document', subtype: 'Docs' },
  { id: 'pricing-test', title: 'Pricing Test', description: 'Pricing page variant with plan comparison, objection handling, and FAQs.', tags: ['Growth', 'Pricing'], accent: '#f59e0b', meta: 'Page · Experiment', type: 'Website', subtype: 'Pricing' },
  { id: 'admin-console', title: 'Admin Console', description: 'Dense operations console with tables, filters, permissions, and status surfaces.', tags: ['Dashboard', 'Admin'], accent: '#0f172a', meta: 'Console · Ops', type: 'Dashboard', subtype: 'Admin' },
  { id: 'education-course', title: 'Education Course', description: 'Course landing page with curriculum, outcomes, instructor proof, and enrollment.', tags: ['Website', 'Education'], accent: '#2563eb', meta: 'Landing · Course', type: 'Website', subtype: 'Education' },
  { id: 'restaurant-booking', title: 'Restaurant Booking', description: 'Hospitality booking flow with menu highlights, reservation states, and local flavor.', tags: ['Website', 'Hospitality'], accent: '#be123c', meta: 'Flow · Booking', type: 'Prototype', subtype: 'Booking' },
  { id: 'real-estate-listing', title: 'Real Estate Listing', description: 'Property listing page with gallery, neighborhood details, pricing, and agent CTA.', tags: ['Website', 'Real estate'], accent: '#0d9488', meta: 'Listing · Responsive', type: 'Website', subtype: 'Real estate' },
  { id: 'support-center', title: 'Support Center', description: 'Help center template with search, popular topics, ticket CTA, and article cards.', tags: ['Website', 'Support'], accent: '#0891b2', meta: 'Help center · Docs', type: 'Website', subtype: 'Support' },
  { id: 'social-campaign', title: 'Social Campaign', description: 'Campaign landing page with story blocks, UGC modules, and social proof.', tags: ['Campaign', 'Marketing'], accent: '#ec4899', meta: 'Campaign · Landing', type: 'Website', subtype: 'Campaign' },
  { id: 'newsletter-brief', title: 'Newsletter Brief', description: 'Editorial newsletter layout with issue intro, feature stories, and sponsor slots.', tags: ['Document', 'Editorial'], accent: '#64748b', meta: 'Email · Editorial', type: 'Document', subtype: 'Editorial' },
  { id: 'roadmap-board', title: 'Roadmap Board', description: 'Product roadmap view with themes, priorities, owners, and progress summaries.', tags: ['Dashboard', 'Product'], accent: '#8b5cf6', meta: 'Board · Product', type: 'Dashboard', subtype: 'Product' },
  { id: 'app-settings', title: 'App Settings', description: 'Settings IA template with account, workspace, billing, and integrations sections.', tags: ['App', 'Settings'], accent: '#334155', meta: 'App · IA', type: 'Prototype', subtype: 'Settings' },
];

const TEMPLATE_TYPE_ORDER: TemplateDemo['type'][] = ['Prototype', 'Slide', 'Website', 'Document', 'Dashboard', 'App'];

interface CommunityViewProps {
  onRemixTemplate?: (templateId: string) => void;
}

export function CommunityView({ onRemixTemplate }: CommunityViewProps) {
  const [previewTemplate, setPreviewTemplate] = useState<TemplateDemo | null>(null);
  const [activeType, setActiveType] = useState<'All' | TemplateDemo['type']>('All');
  const [activeSubtype, setActiveSubtype] = useState('All');
  const typeOptions = TEMPLATE_TYPE_ORDER.filter((type) =>
    COMMUNITY_TEMPLATES.some((template) => template.type === type),
  );
  const subtypeOptions = Array.from(new Set(
    COMMUNITY_TEMPLATES
      .filter((template) => activeType === 'All' || template.type === activeType)
      .map((template) => template.subtype),
  ));
  const filteredTemplates = COMMUNITY_TEMPLATES.filter((template) => {
    const typeMatches = activeType === 'All' || template.type === activeType;
    const subtypeMatches = activeSubtype === 'All' || template.subtype === activeSubtype;
    return typeMatches && subtypeMatches;
  });

  return (
    <section className="community-template-view" aria-labelledby="community-template-title">
      <header className="community-template-view__hero">
        <div>
          <h1 id="community-template-title" className="entry-section__title">Community</h1>
          <p>
            Discover remixable templates. Remix opens a real project immediately — no plugin install,
            no chat setup, just files ready to edit.
          </p>
        </div>
      </header>

      <div className="community-template-view__section-head">
        <h2>Featured templates</h2>
      </div>

      <div className="community-template-view__filters" aria-label="Template filters">
        <div className="community-template-view__filter-main">
          <div className="plugin-marketplace__filters">
            <button
              type="button"
              className={activeType === 'All' ? 'is-active' : ''}
              onClick={() => {
                setActiveType('All');
                setActiveSubtype('All');
              }}
            >
              All
            </button>
            {typeOptions.map((type) => (
              <button
                key={type}
                type="button"
                className={activeType === type ? 'is-active' : ''}
                onClick={() => {
                  setActiveType(type);
                  setActiveSubtype('All');
                }}
              >
                {type}
              </button>
            ))}
          </div>
          <div className="community-template-view__search" role="search">
            <Icon name="search" size={16} />
            <input type="search" placeholder="Search templates" aria-label="Search templates" readOnly />
          </div>
        </div>
        <div className="plugin-marketplace__filters">
          <button
            type="button"
            className={activeSubtype === 'All' ? 'is-active' : ''}
            onClick={() => setActiveSubtype('All')}
          >
            All
          </button>
          {subtypeOptions.map((subtype) => (
            <button
              key={subtype}
              type="button"
              className={activeSubtype === subtype ? 'is-active' : ''}
              onClick={() => setActiveSubtype(subtype)}
            >
              {subtype}
            </button>
          ))}
        </div>
      </div>

      <div className="community-template-grid">
        {filteredTemplates.map((template) => (
          <article
            key={template.id}
            className="community-template-card is-clickable"
            onClick={() => setPreviewTemplate(template)}
          >
            <div
              className="community-template-card__preview"
              style={{ '--template-accent': template.accent } as CSSProperties}
              aria-hidden
            >
              <div className="community-template-card__preview-paper">
                <span />
                <strong>{template.title.split(' ')[0]}</strong>
                <em />
              </div>
            </div>
            <div className="community-template-card__body">
              <div>
                <h3>{template.title}</h3>
                <p>{template.description}</p>
              </div>
              <div className="community-template-card__tags">
                {template.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <div className="community-template-card__foot">
                <span>{template.meta}</span>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onRemixTemplate?.(template.id);
                  }}
                >
                  Remix
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {previewTemplate ? (
        <TemplatePreviewModal
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onRemix={() => onRemixTemplate?.(previewTemplate.id)}
        />
      ) : null}
    </section>
  );
}

function TemplatePreviewModal({
  template,
  onClose,
  onRemix,
}: {
  template: TemplateDemo;
  onClose: () => void;
  onRemix: () => void;
}) {
  return (
    <div className="community-template-preview" role="presentation" onMouseDown={onClose}>
      <section
        className="community-template-preview__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="community-template-preview-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="community-template-preview__head">
          <div>
            <h2 id="community-template-preview-title">{template.title}</h2>
            <p>{template.description}</p>
          </div>
          <button type="button" aria-label="Close preview" onClick={onClose}>
            <Icon name="close" size={17} />
          </button>
        </header>
        <iframe
          title={`${template.title} preview`}
          className="community-template-preview__frame"
          srcDoc={templatePreviewHtml(template)}
        />
        <footer className="community-template-preview__foot">
          <span>{template.meta}</span>
          <button type="button" onClick={onRemix}>Remix</button>
        </footer>
      </section>
    </div>
  );
}

function templatePreviewHtml(template: TemplateDemo): string {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #111827; background: #f8fafc; }
    .shell { min-height: 100vh; padding: 56px; background: linear-gradient(135deg, ${template.accent}1f, #ffffff 42%, #f8fafc); }
    nav { display: flex; justify-content: space-between; align-items: center; margin-bottom: 72px; font-size: 14px; color: #64748b; }
    .logo { display: flex; align-items: center; gap: 10px; color: #111827; font-weight: 800; }
    .mark { width: 28px; height: 28px; border-radius: 9px; background: ${template.accent}; box-shadow: 0 12px 30px ${template.accent}45; }
    .hero { display: grid; grid-template-columns: minmax(0, 1fr) 360px; gap: 56px; align-items: center; }
    h1 { margin: 0; max-width: 740px; font-size: 64px; line-height: .94; letter-spacing: -.04em; }
    p { color: #64748b; line-height: 1.7; font-size: 18px; }
    .cta { display: inline-flex; margin-top: 24px; padding: 14px 20px; border-radius: 999px; background: #111827; color: #fff; font-weight: 750; }
    .card { min-height: 360px; padding: 28px; border: 1px solid #e5e7eb; border-radius: 28px; background: rgba(255,255,255,.82); box-shadow: 0 30px 80px rgba(15,23,42,.12); }
    .stripe { height: 8px; border-radius: 999px; background: ${template.accent}; margin-bottom: 28px; }
    .metric { display: grid; gap: 8px; padding: 18px 0; border-bottom: 1px solid #e5e7eb; }
    .metric strong { font-size: 28px; }
    .sections { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-top: 56px; }
    .section { padding: 22px; border-radius: 20px; background: #fff; border: 1px solid #e5e7eb; }
    .section b { display: block; margin-bottom: 10px; }
  </style>
</head>
<body>
  <main class="shell">
    <nav><span class="logo"><span class="mark"></span>${template.title}</span><span>${template.tags.join(' · ')}</span></nav>
    <section class="hero">
      <div>
        <h1>${template.title} template for polished product storytelling.</h1>
        <p>${template.description}</p>
        <span class="cta">Preview template</span>
      </div>
      <aside class="card">
        <div class="stripe"></div>
        <div class="metric"><span>Primary outcome</span><strong>Clearer launch story</strong></div>
        <div class="metric"><span>Format</span><strong>${template.meta}</strong></div>
        <div class="metric"><span>Style</span><strong>Modern editorial</strong></div>
      </aside>
    </section>
    <section class="sections">
      <div class="section"><b>Structure</b><span>Ready-made sections and hierarchy.</span></div>
      <div class="section"><b>Visual System</b><span>Color, type, rhythm, and reusable blocks.</span></div>
      <div class="section"><b>Editable</b><span>Remix into a real Open Design project.</span></div>
    </section>
  </main>
</body>
</html>`;
}
