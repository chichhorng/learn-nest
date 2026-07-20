import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Protects routes that require authentication.
 * By the time this guard runs, APP_INITIALIZER has already resolved the
 * user from the stored token, so currentUser() is reliable.
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.currentUser()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
