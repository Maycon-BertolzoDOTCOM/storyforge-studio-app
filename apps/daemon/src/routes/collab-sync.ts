import type { Express } from 'express';
import type { CollabRuntime } from '../collab/runtime.js';

export interface RegisterCollabSyncRoutesDeps {
  collab: Pick<CollabRuntime, 'scheduler' | 'publishedVersion'>;
}

/**
 * Team-collab sync trigger, exposed as a client-driven capability (C lane, spec
 * §D1). The client is authoritative about whether it is in a shared context, so
 * it drives the trigger — the daemon does not need D's visibility fact to gate
 * this. Publishing content + advancing the published ref is E's resource面; here
 * we only coalesce and flush.
 */
export function registerCollabSyncRoutes(app: Express, deps: RegisterCollabSyncRoutesDeps): void {
  const { scheduler, publishedVersion } = deps.collab;

  // An author-side edit landed. The publish is coalesced within the scheduler's
  // window so a burst of edits collapses into one publish.
  app.post('/api/projects/:id/collab/changed', (req, res) => {
    scheduler.notifyChanged(req.params.id, 'change');
    res.json({ ok: true });
  });

  // Run boundary — flush any pending publish immediately (publish the stable
  // end-of-run state rather than waiting out the debounce).
  app.post('/api/projects/:id/collab/publish', (req, res) => {
    scheduler.notifyChanged(req.params.id, 'run');
    scheduler.runBoundary(req.params.id);
    res.json({ ok: true });
  });

  // Members poll this to learn the published head version they should pull.
  app.get('/api/projects/:id/collab/status', (req, res) => {
    res.json({ publishedVersion: publishedVersion(req.params.id) });
  });
}
