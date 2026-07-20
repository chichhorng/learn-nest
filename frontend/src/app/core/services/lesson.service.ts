import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lesson } from '../models/course.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  private readonly apiUrl = `${environment.apiUrl}/lessons`;

  constructor(private readonly http: HttpClient) {}

  findOne(id: number): Observable<Lesson> {
    return this.http.get<Lesson>(`${this.apiUrl}/${id}`);
  }

  create(lesson: { title: string; content: string; order: number; isFree: boolean; courseId: number; videoUrl?: string; duration?: number }): Observable<Lesson> {
    return this.http.post<Lesson>(this.apiUrl, lesson);
  }

  update(id: number, lesson: { title?: string; content?: string; order?: number; isFree?: boolean; videoUrl?: string; duration?: number }): Observable<Lesson> {
    return this.http.put<Lesson>(`${this.apiUrl}/${id}`, lesson);
  }

  remove(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
