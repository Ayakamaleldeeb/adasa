import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },

  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },

  {
    path: 'about',
    loadComponent: () => import('./pages/about/about').then((m) => m.About),
  },

  {
    path: 'blog',
    loadComponent: () => import('./pages/blog/blog').then((m) => m.Blog),
  },

  {
    path: 'blog/:slug',
    loadComponent: () => import('./pages/blog-details/blog-details').then((m) => m.BlogDetails),
  },

  {
    path: '404',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },

  {
    path: '**',
    redirectTo: '404',
  },
];
