import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
    {
      path: '',
      loadChildren: () =>
        import('./features/article/article.routing').then(
          (r) => r.ARTICLE_ROUTES
        ),
    },
  ];