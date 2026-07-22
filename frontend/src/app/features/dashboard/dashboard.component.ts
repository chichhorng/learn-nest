import { Component, OnInit, signal, computed, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { EnrollmentService } from '../../core/services/enrollment.service';
import { CourseService } from '../../core/services/course.service';
import { Enrollment, Course } from '../../core/models/course.model';
import { StatsCardComponent } from '../../shared/components/stats-card/stats-card.component';
import { ProgressBarComponent } from '../../shared/components/progress-bar/progress-bar.component';
import { StarRatingComponent } from '../../shared/components/star-rating/star-rating.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, DecimalPipe, StatsCardComponent, ProgressBarComponent, StarRatingComponent, EmptyStateComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  readonly userRole = computed(() => this.authService.currentUser()?.role);

  // Student signals
  readonly studentStats = signal<{ enrolledCoursesCount: number; completedCoursesCount: number; studyHours: number } | null>(null);
  readonly studentCourses = signal<Enrollment[]>([]);

  // Instructor signals
  readonly instructorStats = signal<{ coursesCount: number; totalStudents: number; averageRating: number } | null>(null);
  readonly instructorCourses = signal<Course[]>([]);

  readonly isLoading = signal(true);

  constructor(
    public readonly authService: AuthService,
    private readonly dashboardService: DashboardService,
    private readonly enrollmentService: EnrollmentService,
    private readonly courseService: CourseService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading.set(true);
    const role = this.authService.currentUser()?.role;

    if (role === 'admin') {
      this.router.navigate(['/admin']);
      return;
    }

    if (role === 'student') {
      forkJoin([
        this.dashboardService.getStudentStats(),
        this.enrollmentService.getMyCourses()
      ]).pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe({
        next: ([stats, courses]) => {
          this.studentStats.set(stats);
          this.studentCourses.set(courses);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false)
      });
    } else if (role === 'instructor') {
      forkJoin([
        this.dashboardService.getInstructorStats(),
        this.courseService.getInstructorCourses()
      ]).pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe({
        next: ([stats, courses]) => {
          this.instructorStats.set(stats);
          this.instructorCourses.set(courses);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false)
      });
    } else {
      this.isLoading.set(false);
    }
  }
}
