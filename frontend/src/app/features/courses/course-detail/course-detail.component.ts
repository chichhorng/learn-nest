import { Component, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CourseService } from '../../../core/services/course.service';
import { EnrollmentService } from '../../../core/services/enrollment.service';
import { ReviewService } from '../../../core/services/review.service';
import { AuthService } from '../../../core/services/auth.service';
import { Course } from '../../../core/models/course.model';
import { StarRatingComponent } from '../../../shared/components/star-rating/star-rating.component';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [RouterLink, DecimalPipe, ReactiveFormsModule, StarRatingComponent],
  templateUrl: './course-detail.component.html'
})
export class CourseDetailComponent implements OnInit {
  readonly course = signal<Course | null>(null);
  readonly isEnrolled = signal(false);
  readonly isLoading = signal(true);
  readonly isEnrolling = signal(false);
  readonly isSubmittingReview = signal(false);

  readonly reviewForm = new FormGroup({
    rating: new FormControl(5, { nonNullable: true, validators: [Validators.required, Validators.min(1), Validators.max(5)] }),
    comment: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

  readonly hasReviewed = computed(() => {
    const user = this.authService.currentUser();
    const course = this.course();
    if (!user || !course || !course.reviews) return false;
    return course.reviews.some(r => r.userId === user.id);
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly courseService: CourseService,
    private readonly enrollmentService: EnrollmentService,
    private readonly reviewService: ReviewService,
    public readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const courseId = parseInt(idParam, 10);
      this.loadCourseDetails(courseId);
    } else {
      this.router.navigate(['/courses']);
    }
  }

  private loadCourseDetails(courseId: number): void {
    this.isLoading.set(true);
    this.courseService.findOne(courseId).subscribe({
      next: (course) => {
        this.course.set(course);
        this.checkEnrollmentStatus(courseId);
      },
      error: () => {
        this.isLoading.set(false);
        this.router.navigate(['/courses']);
      }
    });
  }

  private checkEnrollmentStatus(courseId: number): void {
    if (!this.authService.isLoggedIn()) {
      this.isLoading.set(false);
      return;
    }

    this.enrollmentService.getMyCourses().subscribe({
      next: (enrollments) => {
        const enrolled = enrollments.some(e => e.courseId === courseId);
        this.isEnrolled.set(enrolled);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  readonly isUpdatingStatus = signal(false);

  enroll(): void {
    const courseData = this.course();
    if (!courseData) return;

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.authService.currentUser()?.role === 'admin') {
      return; // Admins cannot enroll
    }

    this.isEnrolling.set(true);
    this.enrollmentService.enroll(courseData.id).subscribe({
      next: () => {
        this.isEnrolling.set(false);
        this.router.navigate(['/classroom', courseData.id]);
      },
      error: () => {
        this.isEnrolling.set(false);
      }
    });
  }

  updateStatus(status: 'draft' | 'published' | 'archived'): void {
    const courseData = this.course();
    if (!courseData) return;

    this.isUpdatingStatus.set(true);
    this.courseService.update(courseData.id, { status }).subscribe({
      next: (updated) => {
        this.course.set(updated);
        this.isUpdatingStatus.set(false);
      },
      error: () => {
        this.isUpdatingStatus.set(false);
      }
    });
  }

  submitReview(): void {
    const courseData = this.course();
    if (!courseData || this.reviewForm.invalid) return;

    this.isSubmittingReview.set(true);
    const formVal = this.reviewForm.getRawValue();

    this.reviewService.create({
      rating: formVal.rating,
      comment: formVal.comment,
      courseId: courseData.id
    }).subscribe({
      next: (newReview) => {
        const currentUser = this.authService.currentUser();
        const reviewWithUser = {
          ...newReview,
          user: currentUser || undefined
        };

        const updatedReviews = [...(courseData.reviews || []), reviewWithUser];
        const newAvg = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;

        this.course.set({
          ...courseData,
          reviews: updatedReviews,
          avgRating: newAvg
        });

        this.reviewForm.reset({ rating: 5, comment: '' });
        this.isSubmittingReview.set(false);
      },
      error: () => {
        this.isSubmittingReview.set(false);
      }
    });
  }
}
