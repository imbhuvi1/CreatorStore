import { HomeComponent } from './features/home/home.component';
import { adminGuard } from './core/guards/admin.guard';
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Bhuvnesh Singh Bhadauriya — Java Full Stack Developer' },
  {
    path: 'blog',
    loadComponent: () => import('./features/blog/blog-list.component').then(m => m.BlogListComponent),
    title: 'Writing — Bhuvnesh Singh Bhadauriya'
  },
  {
    path: 'blog/:slug',
    loadComponent: () => import('./features/blog/blog-post.component').then(m => m.BlogPostComponent)
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./features/admin/admin-login.component').then(m => m.AdminLoginComponent),
    title: 'Admin Login'
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    title: 'Admin Dashboard'
  },
  { path: '**', redirectTo: '' }
];
