import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { loggedInGuard } from './core/guards/logged-in.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { 
    path: 'courses', 
    loadComponent: () => import('./features/courses/course-list/course-list.component').then(m => m.CourseListComponent) 
  },
  { 
    path: 'courses/create', 
    loadComponent: () => import('./features/courses/course-form/course-form.component').then(m => m.CourseFormComponent), 
    canActivate: [authGuard, roleGuard], 
    data: { expectedRoles: ['instructor'] } 
  },
  { 
    path: 'courses/edit/:id', 
    loadComponent: () => import('./features/courses/course-form/course-form.component').then(m => m.CourseFormComponent), 
    canActivate: [authGuard, roleGuard], 
    data: { expectedRoles: ['instructor'] } 
  },
  { 
    path: 'courses/:id/syllabus', 
    loadComponent: () => import('./features/courses/syllabus/syllabus.component').then(m => m.SyllabusComponent), 
    canActivate: [authGuard, roleGuard], 
    data: { expectedRoles: ['instructor'] } 
  },
  { 
    path: 'courses/:id', 
    loadComponent: () => import('./features/courses/course-detail/course-detail.component').then(m => m.CourseDetailComponent) 
  },
  { 
    path: 'classroom/:id', 
    loadComponent: () => import('./features/classroom/classroom.component').then(m => m.ClassroomComponent), 
    canActivate: [authGuard] 
  },
  { 
    path: 'login', 
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent),
    canActivate: [loggedInGuard]
  },
  { 
    path: 'register', 
    loadComponent: () => import('./features/auth/register.component').then(m => m.RegisterComponent),
    canActivate: [loggedInGuard]
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent), 
    canActivate: [authGuard] 
  },
  { 
    path: 'profile', 
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent), 
    canActivate: [authGuard] 
  },
  { 
    path: 'admin', 
    loadComponent: () => import('./features/admin/admin-panel.component').then(m => m.AdminPanelComponent), 
    canActivate: [authGuard, roleGuard],
    data: { expectedRoles: ['admin'] }
  },
  { path: '**', redirectTo: '' }
];
