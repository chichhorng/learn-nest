import { Component, OnInit, signal, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './course-form.component.html'
})
export class CourseFormComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  readonly isSaving = signal(false);
  readonly isLoading = signal(false);
  readonly courseId = signal<number | null>(null);
  readonly errorMessage = signal<string | null>(null);

  readonly courseForm = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    category: new FormControl('Development', { nonNullable: true, validators: [Validators.required] }),
    level: new FormControl<'beginner' | 'intermediate' | 'advanced'>('beginner', { nonNullable: true, validators: [Validators.required] }),
    price: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    status: new FormControl<'draft' | 'published' | 'archived'>('draft', { nonNullable: true, validators: [Validators.required] }),
    thumbnail: new FormControl('', { nonNullable: true })
  });

  readonly categories = ['Development', 'Design', 'Marketing', 'Business'];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly courseService: CourseService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = parseInt(idParam, 10);
      this.courseId.set(id);
      this.loadCourse(id);
    } else {
      this.courseForm.controls.status.disable();
    }
  }

  private loadCourse(id: number): void {
    this.isLoading.set(true);
    this.courseService.findOne(id).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (course) => {
        this.courseForm.patchValue({
          title: course.title,
          description: course.description,
          category: course.category,
          level: course.level,
          price: course.price,
          status: course.status,
          thumbnail: course.thumbnail || ''
        });
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      }
    });
  }

  onSubmit(): void {
    if (this.courseForm.invalid) return;

    this.isSaving.set(true);
    this.errorMessage.set(null);

    const values = this.courseForm.getRawValue();
    const id = this.courseId();

    if (id) {
      this.courseService.update(id, values).pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.router.navigate(['/courses', id, 'syllabus']);
        },
        error: (err) => {
          this.errorMessage.set(err.error?.message || 'Failed to update course details.');
          this.isSaving.set(false);
        }
      });
    } else {
      const createValues = {
        title: values.title,
        description: values.description,
        category: values.category,
        level: values.level,
        price: values.price
      };

      this.courseService.create(createValues).pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe({
        next: (newCourse) => {
          this.isSaving.set(false);
          this.router.navigate(['/courses', newCourse.id, 'syllabus']);
        },
        error: (err) => {
          this.errorMessage.set(err.error?.message || 'Failed to create course.');
          this.isSaving.set(false);
        }
      });
    }
  }
}
