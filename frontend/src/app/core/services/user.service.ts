import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SafeUser } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = `${environment.apiUrl}/users`;

  constructor(private readonly http: HttpClient) {}

  getProfile(): Observable<SafeUser> {
    return this.http.get<SafeUser>(`${this.apiUrl}/profile`);
  }

  updateProfile(profile: { name?: string; bio?: string; avatar?: string }): Observable<SafeUser> {
    return this.http.put<SafeUser>(`${this.apiUrl}/profile`, profile);
  }

  getPendingInstructors(): Observable<SafeUser[]> {
    return this.http.get<SafeUser[]>(`${this.apiUrl}/pending-instructors`);
  }

  approveInstructor(id: number): Observable<SafeUser> {
    return this.http.put<SafeUser>(`${this.apiUrl}/${id}/approve`, {});
  }

  getAllUsers(): Observable<SafeUser[]> {
    return this.http.get<SafeUser[]>(this.apiUrl);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  changePassword(passwords: { currentPassword: string; newPassword: string }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/profile/password`, passwords);
  }
}
