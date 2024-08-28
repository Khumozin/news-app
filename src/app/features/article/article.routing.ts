import { Route } from '@angular/router';

export const ARTICLE_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('./pages').then (c => c.ArticlesComponent),
  },
];
