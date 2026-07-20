import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../models/course.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private readonly apiUrl = `${environment.apiUrl}/courses`;

  constructor(private readonly http: HttpClient) {}

  findAll(query?: {
    search?: string;
    category?: string;
    level?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }): Observable<{ items: Course[]; total: number; page: number; limit: number }> {
    let params = new HttpParams();
    if (query) {
      Object.entries(query).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          params = params.set(key, val.toString());
        }
      });
    }
    return this.http.get<{ items: Course[]; total: number; page: number; limit: number }>(this.apiUrl, { params });
  }

  findOne(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`);
  }

  getInstructorCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/my-courses`);
  }

  create(course: { title: string; description: string; category: string; level: string; price: number }): Observable<Course> {
    return this.http.post<Course>(this.apiUrl, course);
  }

  update(id: number, course: { title?: string; description?: string; category?: string; level?: string; price?: number; status?: string; thumbnail?: string }): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/${id}`, course);
  }
}
