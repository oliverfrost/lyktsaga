import { Route } from '@angular/router';
import { BookCatalogPage } from './book-catalog-page/book-catalog-page';

export const bookCatalogRoutes: Route[] = [
  {
    path: '',
    component: BookCatalogPage,
  },
];
