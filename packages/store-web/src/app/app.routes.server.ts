import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    // The catalog is fetched from a live API per request, so it must be
    // server-rendered on demand rather than prerendered at build time.
    path: '**',
    renderMode: RenderMode.Server,
  },
];
