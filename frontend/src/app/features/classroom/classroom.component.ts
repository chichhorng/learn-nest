import { Component, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CourseService } from '../../core/services/course.service';
import { EnrollmentService } from '../../core/services/enrollment.service';
import { LessonService } from '../../core/services/lesson.service';
import { AuthService } from '../../core/services/auth.service';
import { Course, Lesson, Enrollment } from '../../core/models/course.model';
import { ProgressBarComponent } from '../../shared/components/progress-bar/progress-bar.component';

@Component({
  selector: 'app-classroom',
  standalone: true,
  imports: [RouterLink, ProgressBarComponent],
  templateUrl: './classroom.component.html',
  styleUrl: './classroom.component.css'
})
export class ClassroomComponent implements OnInit {
  readonly course = signal<Course | null>(null);
  readonly enrollment = signal<Enrollment | null>(null);
  readonly currentLesson = signal<Lesson | null>(null);
  readonly isLoading = signal(true);
  readonly isProgressUpdating = signal(false);

  // Computed signals for stats
  readonly completedCount = computed(() => {
    return this.enrollment()?.completedLessons?.length ?? 0;
  });

  readonly totalCount = computed(() => {
    return this.course()?.lessons?.length ?? 0;
  });

  readonly progressPercentage = computed(() => {
    const total = this.totalCount();
    const completed = this.completedCount();
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly courseService: CourseService,
    private readonly enrollmentService: EnrollmentService,
    private readonly lessonService: LessonService,
    public readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const courseId = parseInt(idParam, 10);
      this.loadClassroomData(courseId);
    } else {
      this.router.navigate(['/courses']);
    }
  }

  private loadClassroomData(courseId: number): void {
    this.isLoading.set(true);

    // Admins can view any classroom without being enrolled
    if (this.authService.currentUser()?.role === 'admin') {
      this.courseService.findOne(courseId).subscribe({
        next: (course) => {
          this.course.set(course);
          if (course.lessons && course.lessons.length > 0) {
            this.currentLesson.set(course.lessons[0]);
          }
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
          this.router.navigate(['/courses']);
        }
      });
      return;
    }

    this.enrollmentService.getMyCourses().subscribe({
      next: (enrollments) => {
        const activeEnrollment = enrollments.find(e => e.courseId === courseId);
        
        if (!activeEnrollment) {
          this.router.navigate(['/courses', courseId]);
          return;
        }

        this.enrollment.set(activeEnrollment);

        this.courseService.findOne(courseId).subscribe({
          next: (course) => {
            this.course.set(course);

            if (course.lessons && course.lessons.length > 0) {
              const firstIncomplete = course.lessons.find(
                l => !activeEnrollment.completedLessons.includes(l.id)
              );
              this.currentLesson.set(firstIncomplete || course.lessons[0]);
            }
            this.isLoading.set(false);
          },
          error: () => {
            this.isLoading.set(false);
            this.router.navigate(['/courses']);
          }
        });
      },
      error: () => {
        this.isLoading.set(false);
        this.router.navigate(['/courses']);
      }
    });
  }

  selectLesson(lesson: Lesson): void {
    this.currentLesson.set(lesson);
  }

  isLessonCompleted(lessonId: number): boolean {
    const completed = this.enrollment()?.completedLessons || [];
    return completed.includes(lessonId);
  }

  toggleLessonCompletion(lessonId: number, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const courseId = this.course()?.id;

    if (!courseId) return;

    this.isProgressUpdating.set(true);
    this.enrollmentService.updateProgress(courseId, lessonId, checked).subscribe({
      next: (updatedEnrollment) => {
        this.enrollment.set(updatedEnrollment);
        this.isProgressUpdating.set(false);
      },
      error: () => {
        this.isProgressUpdating.set(false);
        const current = this.enrollment();
        if (current) this.enrollment.set({ ...current });
      }
    });
  }
}
