import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Enrollment } from '../models/course.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private readonly apiUrl = `${environment.apiUrl}/enrollments`;

  constructor(private readonly http: HttpClient) {}

  enroll(courseId: number): Observable<Enrollment> {
    return this.http.post<Enrollment>(`${this.apiUrl}/enroll`, { courseId });
  }

  getMyCourses(): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.apiUrl}/my-courses`);
  }

  updateProgress(courseId: number, lessonId: number, completed: boolean): Observable<Enrollment> {
    return this.http.put<Enrollment>(`${this.apiUrl}/progress`, { courseId, lessonId, completed });
  }
}
