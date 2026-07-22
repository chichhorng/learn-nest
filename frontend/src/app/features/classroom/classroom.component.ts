import { Component, OnInit, OnDestroy, signal, computed, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { switchMap, map, of } from 'rxjs';
import { CourseService } from '../../core/services/course.service';
import { EnrollmentService } from '../../core/services/enrollment.service';
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
export class ClassroomComponent implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  readonly course = signal<Course | null>(null);
  readonly enrollment = signal<Enrollment | null>(null);
  readonly currentLesson = signal<Lesson | null>(null);
  readonly isLoading = signal(true);
  readonly isProgressUpdating = signal(false);
  private youtubeMessageListener: ((event: MessageEvent) => void) | null = null;
  private handshakeInterval: ReturnType<typeof setInterval> | null = null;

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

  readonly isYouTubeVideo = computed(() => {
    const url = this.currentLesson()?.videoUrl;
    if (!url) return false;
    return url.includes('youtube.com') || url.includes('youtu.be');
  });

  readonly safeYouTubeUrl = computed<SafeResourceUrl | null>(() => {
    const url = this.currentLesson()?.videoUrl;
    if (!url) return null;

    let videoId = '';

    if (url.includes('youtu.be/')) {
      const parts = url.split('youtu.be/');
      if (parts.length > 1) {
        videoId = parts[1].split('?')[0];
      }
    } else if (url.includes('youtube.com/watch')) {
      const parts = url.split('v=');
      if (parts.length > 1) {
        videoId = parts[1].split('&')[0];
      }
    } else if (url.includes('youtube.com/embed/')) {
      const parts = url.split('embed/');
      if (parts.length > 1) {
        videoId = parts[1].split('?')[0];
      }
    }

    if (videoId) {
      const origin = window.location.origin;
      const embedUrl = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${encodeURIComponent(origin)}`;
      return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    }

    return null;
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly courseService: CourseService,
    private readonly enrollmentService: EnrollmentService,
    public readonly authService: AuthService,
    private readonly sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const courseId = parseInt(idParam, 10);
      this.loadClassroomData(courseId);
    } else {
      this.router.navigate(['/courses']);
    }

    // Capture postMessages directly from the YouTube IFrame
    this.youtubeMessageListener = (event: MessageEvent) => {
      const isYouTubeOrigin = event.origin.includes('youtube.com') || event.origin.includes('youtube-nocookie.com');
      
      if (isYouTubeOrigin && this.handshakeInterval) {
        // Stop the handshake polling once the player responds and starts sending messages!
        clearInterval(this.handshakeInterval);
        this.handshakeInterval = null;
      }

      if (!isYouTubeOrigin || !this.enrollment()) return;

      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;

        if (data && data.event === 'onStateChange') {
          if (data.info === 0) {
            this.onVideoEnded();
          }
        }

        // 2. Detect progress and completion from infoDelivery event
        if (data && data.event === 'infoDelivery' && data.info) {
          const currentTime = data.info.currentTime;
          const duration = data.info.duration;
          
          if (typeof currentTime === 'number' && typeof duration === 'number' && duration > 0) {
            if (duration - currentTime <= 3) {
              this.onVideoEnded();
            }
          }

          // Fallback check: infoDelivery reports playerState: 0 (ended)
          if (data.info.playerState === 0) {
            this.onVideoEnded();
          }
        }
      } catch (e) {
        // Ignore unparseable or irrelevant messages
      }
    };

    window.addEventListener('message', this.youtubeMessageListener);
  }

  onIframeLoad(event: Event): void {
    const iframe = event.target as HTMLIFrameElement;
    if (!iframe || !iframe.contentWindow) return;

    // Clear any existing handshake interval
    if (this.handshakeInterval) {
      clearInterval(this.handshakeInterval);
    }

    // Poll the handshake every 500ms until the player starts communicating
    this.handshakeInterval = setInterval(() => {
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(JSON.stringify({ event: 'listening' }), '*');
      }
    }, 500);
  }

  private loadClassroomData(courseId: number): void {
    this.isLoading.set(true);
    const currentUser = this.authService.currentUser();

    this.courseService.findOne(courseId).pipe(
      takeUntilDestroyed(this.destroyRef),
      switchMap((course) => {
        const isAdmin = currentUser?.role === 'admin';
        const isInstructor = course.instructorId === currentUser?.id;

        if (isAdmin || isInstructor) {
          return of({ course, enrollment: null });
        }

        return this.enrollmentService.getMyCourses().pipe(
          map((enrollments) => {
            const activeEnrollment = enrollments.find(e => e.courseId === courseId);
            if (!activeEnrollment) {
              throw new Error('Not enrolled');
            }
            return { course, enrollment: activeEnrollment };
          })
        );
      })
    ).subscribe({
      next: ({ course, enrollment }) => {
        this.course.set(course);
        this.enrollment.set(enrollment);

        if (course.lessons && course.lessons.length > 0) {
          if (enrollment) {
            const firstIncomplete = course.lessons.find(
              l => !enrollment.completedLessons.includes(l.id)
            );
            this.currentLesson.set(firstIncomplete || course.lessons[0]);
          } else {
            this.currentLesson.set(course.lessons[0]);
          }
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.router.navigate(['/courses', courseId]);
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
    this.enrollmentService.updateProgress(courseId, lessonId, checked).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
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

  ngOnDestroy(): void {
    if (this.youtubeMessageListener) {
      window.removeEventListener('message', this.youtubeMessageListener);
    }
    if (this.handshakeInterval) {
      clearInterval(this.handshakeInterval);
      this.handshakeInterval = null;
    }
  }

  onVideoTimeUpdate(event: Event): void {
    const video = event.target as HTMLVideoElement;
    if (video && video.duration > 0) {
      if (video.duration - video.currentTime <= 3) {
        this.onVideoEnded();
      }
    }
  }

  onVideoEnded(): void {
    const lesson = this.currentLesson();
    const courseId = this.course()?.id;
    const enrollment = this.enrollment();
    if (!lesson || !courseId || !enrollment) return;

    // Check if the lesson is already marked as completed
    if (this.isLessonCompleted(lesson.id)) {
      return;
    }

    this.isProgressUpdating.set(true);
    this.enrollmentService.updateProgress(courseId, lesson.id, true).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (updatedEnrollment) => {
        this.enrollment.set(updatedEnrollment);
        this.isProgressUpdating.set(false);
      },
      error: (err) => {
        console.error('Error updating progress:', err);
        this.isProgressUpdating.set(false);
      }
    });
  }
}
