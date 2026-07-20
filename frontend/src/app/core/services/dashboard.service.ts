import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly apiUrl = `${environment.apiUrl}/dashboard`;

  constructor(private readonly http: HttpClient) {}

  getStudentStats(): Observable<{ enrolledCoursesCount: number; completedCoursesCount: number; studyHours: number }> {
    return this.http.get<{ enrolledCoursesCount: number; completedCoursesCount: number; studyHours: number }>(`${this.apiUrl}/student-stats`);
  }

  getInstructorStats(): Observable<{ coursesCount: number; totalStudents: number; averageRating: number }> {
    return this.http.get<{ coursesCount: number; totalStudents: number; averageRating: number }>(`${this.apiUrl}/instructor-stats`);
  }
}
