// Community — the marketplace gallery that used to sit at the bottom of Home,
// promoted to its own left-rail destination. Reuses the same PluginsHomeSection
// "gallery" surface (category facets + live-preview tiles) so the content is
// identical to the old Home Community section, without the plugin-management
// chrome that PluginsView wraps around it.

import { useEffect, useState } from 'react';
import type { InstalledPluginRecord } from '@open-design/contracts';
import { listPlugins } from '../state/projects';
import { PluginsHomeSection } from './PluginsHomeSection';
import { PluginDetailsModal } from './PluginDetailsModal';
import { useT } from '../i18n';

export function CommunityView() {
  const t = useT();
  const [plugins, setPlugins] = useState<InstalledPluginRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState<InstalledPluginRecord | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      void listPlugins().then((rows) => {
        if (cancelled) return;
        setPlugins(rows);
        setLoading(false);
      });
    };
    load();
    window.addEventListener('open-design:plugins-changed', load);
    return () => {
      cancelled = true;
      window.removeEventListener('open-design:plugins-changed', load);
    };
  }, []);

  return (
    <div className="entry-section">
      <header className="entry-section__head">
        <h1 className="entry-section__title">{t('pluginsHome.title')}</h1>
      </header>
      <PluginsHomeSection
        plugins={plugins}
        loading={loading}
        activePluginId={null}
        pendingApplyId={null}
        onUse={() => {}}
        onOpenDetails={(record) => setDetails(record)}
        preferDefaultFacet={false}
        cardLayout="gallery"
      />
      {details ? (
        <PluginDetailsModal
          record={details}
          onClose={() => setDetails(null)}
          onUse={() => {}}
          hideUseAction
        />
      ) : null}
    </div>
  );
}
