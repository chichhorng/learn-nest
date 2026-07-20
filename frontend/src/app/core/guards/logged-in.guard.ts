import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Guard for public-only routes (login, register).
 * APP_INITIALIZER has already resolved the user, so we just check currentUser().
 * Redirects already-authenticated users to /dashboard.
 */
export const loggedInGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.currentUser()) {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
