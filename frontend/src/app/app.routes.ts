import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { loggedInGuard } from './core/guards/logged-in.guard';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    title: 'LearnNest — Empower Your Learning Journey'
  },
  { 
    path: 'courses', 
    loadComponent: () => import('./features/courses/course-list/course-list.component').then(m => m.CourseListComponent),
    title: 'Browse Courses — LearnNest'
  },
  { 
    path: 'courses/create', 
    loadComponent: () => import('./features/courses/course-form/course-form.component').then(m => m.CourseFormComponent), 
    canActivate: [authGuard, roleGuard], 
    data: { expectedRoles: ['instructor'] },
    title: 'Create New Course — LearnNest'
  },
  { 
    path: 'courses/edit/:id', 
    loadComponent: () => import('./features/courses/course-form/course-form.component').then(m => m.CourseFormComponent), 
    canActivate: [authGuard, roleGuard], 
    data: { expectedRoles: ['instructor'] },
    title: 'Edit Course — LearnNest'
  },
  { 
    path: 'courses/:id/syllabus', 
    loadComponent: () => import('./features/courses/syllabus/syllabus.component').then(m => m.SyllabusComponent), 
    canActivate: [authGuard, roleGuard], 
    data: { expectedRoles: ['instructor'] },
    title: 'Manage Syllabus — LearnNest'
  },
  { 
    path: 'courses/:id', 
    loadComponent: () => import('./features/courses/course-detail/course-detail.component').then(m => m.CourseDetailComponent),
    title: 'Course Details — LearnNest'
  },
  { 
    path: 'classroom/:id', 
    loadComponent: () => import('./features/classroom/classroom.component').then(m => m.ClassroomComponent), 
    canActivate: [authGuard],
    title: 'Classroom Workspace — LearnNest'
  },
  { 
    path: 'login', 
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent),
    canActivate: [loggedInGuard],
    title: 'Sign In — LearnNest'
  },
  { 
    path: 'register', 
    loadComponent: () => import('./features/auth/register.component').then(m => m.RegisterComponent),
    canActivate: [loggedInGuard],
    title: 'Create Account — LearnNest'
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent), 
    canActivate: [authGuard],
    title: 'Dashboard — LearnNest'
  },
  { 
    path: 'profile', 
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent), 
    canActivate: [authGuard],
    title: 'My Profile — LearnNest'
  },
  { 
    path: 'admin', 
    loadComponent: () => import('./features/admin/admin-panel.component').then(m => m.AdminPanelComponent), 
    canActivate: [authGuard, roleGuard],
    data: { expectedRoles: ['admin'] },
    title: 'Admin Console — LearnNest'
  },
  {
    path: '404',
    loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: 'Page Not Found — LearnNest'
  },
  { path: '**', redirectTo: '404' }
];
