import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of } from 'rxjs';
import { SafeUser } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  
  readonly currentUser = signal<SafeUser | null>(null);
  readonly isLoggedIn = computed(() => this.currentUser() !== null);
  readonly userRole = computed(() => this.currentUser()?.role ?? null);
  readonly isApproved = computed(() => this.currentUser()?.isApproved ?? false);

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  /** Called by APP_INITIALIZER before the router starts. */
  initialize(): Observable<SafeUser | null> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return of(null);
    }
    return this.loadCurrentUser().pipe(
      catchError(() => {
        this.clearSession();
        return of(null);
      })
    );
  }

  login(credentials: any): Observable<{ user: SafeUser; token: string }> {
    return this.http.post<{ user: SafeUser; token: string }>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        localStorage.setItem('auth_token', res.token);
        this.currentUser.set(res.user);
      })
    );
  }

  register(details: any): Observable<{ user: SafeUser; token: string }> {
    return this.http.post<{ user: SafeUser; token: string }>(`${this.apiUrl}/register`, details).pipe(
      tap(res => {
        if (res.user.role === 'instructor' && !res.user.isApproved) {
          return;
        }
        localStorage.setItem('auth_token', res.token);
        this.currentUser.set(res.user);
      })
    );
  }

  loadCurrentUser(): Observable<SafeUser> {
    return this.http.get<SafeUser>(`${this.apiUrl}/me`).pipe(
      tap(user => {
        this.currentUser.set(user);
      })
    );
  }

  logout(): void {
    this.clearSession();
    this.router.navigate(['/']);
  }

  clearSession(): void {
    localStorage.removeItem('auth_token');
    this.currentUser.set(null);
  }
}

/** APP_INITIALIZER factory — runs once before the router starts. */
export function initializeAuth() {
  const authService = inject(AuthService);
  return () => authService.initialize();
}
