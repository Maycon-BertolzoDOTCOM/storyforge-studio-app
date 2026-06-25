import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAnalytics } from '../analytics/provider';
import {
  trackDesignSystemsTemplatesModalClick,
  trackDesignSystemsTemplatesModalSharePopoverClick,
  trackDesignSystemsTemplatesModalSurfaceView,
} from '../analytics/events';
import { useT } from '../i18n';
import type { DesignSystemSummary } from '../types';
import { DesignSystemKitPreview } from './DesignSystemKitPreview';
import { PreviewModal } from './PreviewModal';

interface Props {
  system: DesignSystemSummary;
  onClose: () => void;
}

// Full DS preview: reuse the same brand-kit-style module stack that powers the
// Design Systems detail pane, so picker expansion and the manager page stay in
// visual parity.
export function DesignSystemPreviewModal({ system, onClose }: Props) {
  const t = useT();
  const analytics = useAnalytics();
  const surfaceViewFiredRef = useRef<string | null>(null);
  useEffect(() => {
    if (surfaceViewFiredRef.current === system.id) return;
    surfaceViewFiredRef.current = system.id;
    trackDesignSystemsTemplatesModalSurfaceView(analytics.track, {
      page_name: 'design_systems',
      area: 'templates_modal',
      templates_id: system.id,
      templates_type: system.source ?? 'library',
    });
  }, [analytics.track, system.id, system.source]);
  const detail = (
    <PreviewModal
      title={system.title}
      subtitle={system.summary || system.category}
      views={[
        {
          id: 'kit',
          label: t('brandDetail.designSystem'),
          custom: (
            <DesignSystemKitPreview
              system={system}
              variant="panel"
              showCover={false}
              className="ds-modal-kit-preview"
              dataTestId={`design-system-modal-kit-${system.id}`}
            />
          ),
        },
      ]}
      initialViewId="kit"
      exportTitleFor={() => system.title}
      onClose={onClose}
      onFullscreenClick={() =>
        trackDesignSystemsTemplatesModalClick(analytics.track, {
          page_name: 'design_systems',
          area: 'templates_modal',
          element: 'fullscreen',
          templates_id: system.id,
          templates_type: system.source ?? 'library',
        })
      }
      onShareClick={() =>
        trackDesignSystemsTemplatesModalClick(analytics.track, {
          page_name: 'design_systems',
          area: 'templates_modal',
          element: 'share',
          templates_id: system.id,
          templates_type: system.source ?? 'library',
        })
      }
      onSharePopoverItemClick={(item) =>
        trackDesignSystemsTemplatesModalSharePopoverClick(analytics.track, {
          page_name: 'design_systems',
          area: 'templates_modal_share_popover',
          element: item,
          templates_id: system.id,
          templates_type: system.source ?? 'library',
        })
      }
    />
  );

  if (typeof document === 'undefined') return detail;
  return createPortal(detail, document.body);
}
