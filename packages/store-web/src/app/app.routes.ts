import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('./features/book-catalog/book-catalog.routes').then(
        (m) => m.bookCatalogRoutes,
      ),
  },
];
