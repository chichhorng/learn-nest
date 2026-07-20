import { Component, OnInit, signal, computed, DestroyRef, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CourseService } from '../../../core/services/course.service';
import { Course } from '../../../core/models/course.model';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { CourseCardComponent } from '../../../shared/components/course-card/course-card.component';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [ReactiveFormsModule, EmptyStateComponent, CourseCardComponent],
  templateUrl: './course-list.component.html'
})
export class CourseListComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  readonly courses = signal<Course[]>([]);
  readonly totalCourses = signal(0);
  readonly isLoading = signal(false);

  // Filter signals
  readonly search = signal('');
  readonly category = signal('');
  readonly level = signal('');
  readonly sort = signal('createdAt:desc');
  readonly page = signal(1);
  readonly limit = signal(8);

  readonly searchControl = new FormControl('');

  readonly totalPages = computed(() => {
    const total = this.totalCourses();
    const limit = this.limit();
    return Math.max(1, Math.ceil(total / limit));
  });

  // Unique categories for the UI tabs
  readonly categories = ['', 'Development', 'Design', 'Marketing', 'Business'];

  constructor(private readonly courseService: CourseService) {}

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(val => {
      this.search.set(val || '');
      this.page.set(1);
      this.loadCourses();
    });

    this.loadCourses();
  }

  loadCourses(): void {
    this.isLoading.set(true);
    this.courseService.findAll({
      search: this.search(),
      category: this.category(),
      level: this.level(),
      sort: this.sort(),
      page: this.page(),
      limit: this.limit()
    }).subscribe({
      next: (res) => {
        this.courses.set(res.items);
        this.totalCourses.set(res.total);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  setCategory(category: string): void {
    if (this.isLoading()) return;
    this.category.set(category);
    this.page.set(1);
    this.loadCourses();
  }

  setLevel(level: string): void {
    if (this.isLoading()) return;
    this.level.set(level);
    this.page.set(1);
    this.loadCourses();
  }

  setSort(sort: string): void {
    if (this.isLoading()) return;
    this.sort.set(sort);
    this.page.set(1);
    this.loadCourses();
  }

  prevPage(): void {
    if (this.page() > 1 && !this.isLoading()) {
      this.page.update(p => p - 1);
      this.loadCourses();
    }
  }

  nextPage(): void {
    if (this.page() < this.totalPages() && !this.isLoading()) {
      this.page.update(p => p + 1);
      this.loadCourses();
    }
  }
}
