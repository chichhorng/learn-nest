import { Component, signal, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  private readonly destroyRef = inject(DestroyRef);

  readonly registerForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(1)] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
    role: new FormControl<'student' | 'instructor' | 'admin'>('student', { nonNullable: true, validators: [Validators.required] })
  });

  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly isSuccessPending = signal(false);

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  setRole(role: 'student' | 'instructor'): void {
    if (this.isLoading()) return;
    this.registerForm.patchValue({ role });
  }

  getSelectedRole(): 'student' | 'instructor' | 'admin' {
    return this.registerForm.controls.role.value || 'student';
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const payload = this.registerForm.getRawValue();

    this.authService.register(payload).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        this.isLoading.set(false);
        // If they registered as an instructor, show the pending approval card
        if (payload.role === 'instructor') {
          this.isSuccessPending.set(true);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        const backendMessage = err.error?.message;
        this.errorMessage.set(backendMessage || 'Registration failed. Email might already be taken.');
      }
    });
  }

  isFieldInvalid(fieldName: 'name' | 'email' | 'password' | 'role'): boolean {
    const field = this.registerForm.controls[fieldName];
    return !!field && field.invalid && (field.dirty || field.touched);
  }
}
