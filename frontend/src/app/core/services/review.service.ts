import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../models/course.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private readonly apiUrl = `${environment.apiUrl}/reviews`;

  constructor(private readonly http: HttpClient) {}

  create(review: { rating: number; comment: string; courseId: number }): Observable<Review> {
    return this.http.post<Review>(this.apiUrl, review);
  }
}
