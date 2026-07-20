import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserRole, SafeUser } from '../models/user.model';

/**
 * Protects routes by role. Must come after authGuard in the canActivate chain.
 * APP_INITIALIZER ensures currentUser() is already populated.
 */
export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRoles = route.data['expectedRoles'] as UserRole[];

  const checkRole = (user: SafeUser | null): boolean => {
    if (!user) {
      router.navigate(['/login']);
      return false;
    }

    // Pending instructors are only allowed to see the dashboard/profile, not instructor tools
    if (user.role === 'instructor' && !user.isApproved) {
      if (expectedRoles && expectedRoles.includes('instructor')) {
        router.navigate(['/dashboard']);
        return false;
      }
    }

    if (expectedRoles && expectedRoles.includes(user.role)) {
      return true;
    }

    router.navigate(['/dashboard']);
    return false;
  };

  return checkRole(authService.currentUser());
};
