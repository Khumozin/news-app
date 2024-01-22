import { Route } from '@angular/router';

import { ArticlesComponent } from './pages';

export const ARTICLE_ROUTES: Route[] = [
  {
    path: '',
    component: ArticlesComponent,
  },
];
