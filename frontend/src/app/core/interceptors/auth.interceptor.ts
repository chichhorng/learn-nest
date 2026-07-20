import { HttpInterceptorFn, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

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
      }
      return throwError(() => error);
    })
  );
};
