import { Route } from '@angular/router';

const ARTICLE_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('./articles'),
  },
];

export default ARTICLE_ROUTES;
