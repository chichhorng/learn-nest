import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  readonly registerForm: FormGroup;
  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly isSuccessPending = signal(false);

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['student', [Validators.required]]
    });
  }

  setRole(role: 'student' | 'instructor'): void {
    if (this.isLoading()) return;
    this.registerForm.patchValue({ role });
  }

  getSelectedRole(): 'student' | 'instructor' {
    return this.registerForm.get('role')?.value || 'student';
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const payload = this.registerForm.value;

    this.authService.register(payload).subscribe({
      next: (res) => {
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

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!field && field.invalid && (field.dirty || field.touched);
  }
}
