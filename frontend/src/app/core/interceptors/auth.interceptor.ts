import { HttpInterceptorFn, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth_token');
  let authReq = req;

  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  return next(authReq).pipe(
    map(event => {
      if (event instanceof HttpResponse && event.body && typeof event.body === 'object' && 'data' in event.body) {
        return event.clone({ body: (event.body as any).data });
      }
      return event;
    }),
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/auth/me')) {
        authService.clearSession();
        router.navigate(['/login']);
        toastService.warning('Session expired. Please log in again.');
      } else if (error.status === 0) {
        toastService.error('Unable to connect to server. Please check your connection.');
      } else if (error.status >= 500) {
        toastService.error('Server error encountered. Please try again later.');
      }
      return throwError(() => error);
    })
  );
};
