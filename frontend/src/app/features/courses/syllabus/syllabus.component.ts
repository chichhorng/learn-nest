import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';
import { LessonService } from '../../../core/services/lesson.service';
import { Course, Lesson } from '../../../core/models/course.model';
import { ConfirmService } from '../../../shared/components/confirm-dialog/confirm.service';

@Component({
  selector: 'app-syllabus',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './syllabus.component.html',
  styleUrl: './syllabus.component.css'
})
export class SyllabusComponent implements OnInit {
  readonly course = signal<Course | null>(null);
  readonly isLoading = signal(true);
  readonly isSaving = signal(false);
  readonly isModalOpen = signal(false);
  readonly editingLesson = signal<Lesson | null>(null);
  readonly errorMessage = signal<string | null>(null);

  readonly lessonForm = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
    content: new FormControl('', { nonNullable: true }),
    order: new FormControl(1, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    isFree: new FormControl(false, { nonNullable: true }),
    duration: new FormControl(10, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    videoUrl: new FormControl('', { nonNullable: true })
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly courseService: CourseService,
    private readonly lessonService: LessonService,
    private readonly confirmService: ConfirmService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const courseId = parseInt(idParam, 10);
      this.loadCourse(courseId);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  private loadCourse(id: number): void {
    this.isLoading.set(true);
    this.courseService.findOne(id).subscribe({
      next: (course) => {
        this.course.set(course);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      }
    });
  }

  openAddModal(): void {
    this.editingLesson.set(null);
    const nextOrder = (this.course()?.lessons?.length || 0) + 1;
    this.lessonForm.reset({
      title: '',
      content: '',
      order: nextOrder,
      isFree: false,
      duration: 10,
      videoUrl: ''
    });
    this.isModalOpen.set(true);
  }

  openEditModal(lesson: Lesson): void {
    this.editingLesson.set(lesson);
    this.lessonForm.patchValue({
      title: lesson.title,
      content: lesson.content || '',
      order: lesson.order,
      isFree: lesson.isFree,
      duration: lesson.duration,
      videoUrl: lesson.videoUrl || ''
    });
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.editingLesson.set(null);
    this.errorMessage.set(null);
  }

  onSubmitLesson(): void {
    if (this.lessonForm.invalid) return;

    const courseData = this.course();
    if (!courseData) return;

    this.isSaving.set(true);
    this.errorMessage.set(null);

    const values = this.lessonForm.getRawValue();
    const activeLesson = this.editingLesson();

    if (activeLesson) {
      // Edit mode
      this.lessonService.update(activeLesson.id, values).subscribe({
        next: (updatedLesson) => {
          const currentLessons = courseData.lessons || [];
          const updatedLessons = currentLessons.map(l => l.id === activeLesson.id ? updatedLesson : l);
          updatedLessons.sort((a, b) => a.order - b.order);

          this.course.set({
            ...courseData,
            lessons: updatedLessons
          });

          this.isSaving.set(false);
          this.closeModal();
        },
        error: (err) => {
          this.errorMessage.set(err.error?.message || 'Failed to update lesson.');
          this.isSaving.set(false);
        }
      });
    } else {
      // Add mode
      const payload = {
        ...values,
        courseId: courseData.id
      };

      this.lessonService.create(payload).subscribe({
        next: (newLesson) => {
          const currentLessons = courseData.lessons || [];
          const updatedLessons = [...currentLessons, newLesson];
          updatedLessons.sort((a, b) => a.order - b.order);

          this.course.set({
            ...courseData,
            lessons: updatedLessons
          });

          this.isSaving.set(false);
          this.closeModal();
        },
        error: (err) => {
          this.errorMessage.set(err.error?.message || 'Failed to add lesson.');
          this.isSaving.set(false);
        }
      });
    }
  }

  async deleteLesson(lessonId: number): Promise<void> {
    const confirmed = await this.confirmService.confirm({
      title: 'Delete Lesson',
      message: 'Are you sure you want to delete this lesson? This action cannot be undone.',
      confirmText: 'Delete',
      type: 'danger'
    });

    if (!confirmed) {
      return;
    }

    const courseData = this.course();
    if (!courseData) return;

    this.lessonService.remove(lessonId).subscribe({
      next: () => {
        const currentLessons = courseData.lessons || [];
        const updatedLessons = currentLessons.filter(l => l.id !== lessonId);
        
        this.course.set({
          ...courseData,
          lessons: updatedLessons
        });
      }
    });
  }
}
