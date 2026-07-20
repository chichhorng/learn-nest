import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { Course } from '../../../core/models/course.model';
import { StarRatingComponent } from '../star-rating/star-rating.component';

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [RouterLink, DecimalPipe, StarRatingComponent],
  template: `
    <div
      [routerLink]="['/courses', course().id]"
      class="bg-card border border-border rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all p-5 flex flex-col justify-between cursor-pointer group h-full"
    >
      <div class="space-y-4">
        <!-- Thumbnail Placeholder / Image -->
        <div class="relative w-full h-40 bg-muted rounded-lg overflow-hidden flex items-center justify-center border border-border">
          @if (course().thumbnail) {
            <img [src]="course().thumbnail" alt="Course Thumbnail" class="w-full h-full object-cover transition-transform group-hover:scale-105" />
          } @else {
            <!-- Nice SVG Icon placeholder based on category -->
            <div class="text-muted-foreground text-center">
              <svg class="w-12 h-12 mx-auto mb-1 opacity-40 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span class="text-xs uppercase tracking-wider font-semibold opacity-60 text-primary">{{ course().category }}</span>
            </div>
          }
        </div>

        <!-- Title & Instructor -->
        <div>
          <h3 class="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-1">
            {{ course().title }}
          </h3>
          <p class="text-xs text-muted-foreground font-medium">
            By {{ course().instructor?.name || 'Instructor' }}
          </p>
        </div>

        <!-- Badges -->
        <div class="flex flex-wrap gap-1.5">
          <span class="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider">
            {{ course().category }}
          </span>
          <span class="bg-muted text-muted-foreground px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider">
            {{ course().level }}
          </span>
        </div>
      </div>

      <!-- Bottom: Rating, Enrolled, Price -->
      <div class="pt-4 mt-4 border-t border-border/60 flex items-center justify-between">
        <!-- Rating & Enrolled -->
        <div class="space-y-1">
          <div class="flex items-center gap-1">
            <app-star-rating [rating]="course().avgRating" size="xs"></app-star-rating>
            <span class="text-xs font-bold text-foreground mt-0.5">{{ course().avgRating | number:'1.1-1' }}</span>
          </div>
          <p class="text-[10px] text-muted-foreground font-medium">
            {{ course().enrollCount }} students enrolled
          </p>
        </div>

        <!-- Price -->
        <div>
          @if (course().price === 0) {
            <span class="text-sm font-extrabold text-emerald-500 uppercase tracking-wide">Free</span>
          } @else {
            <span class="text-base font-extrabold text-foreground">$ {{ course().price | number:'1.2-2' }}</span>
          }
        </div>
      </div>
    </div>
  `
})
export class CourseCardComponent {
  readonly course = input.required<Course>();
}
