import { Component, OnInit, signal, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  readonly isSaving = signal(false);
  readonly successMessage = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  readonly isSavingPassword = signal(false);
  readonly passwordSuccessMessage = signal<string | null>(null);
  readonly passwordErrorMessage = signal<string | null>(null);

  readonly profileForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    avatar: new FormControl('', { nonNullable: true }),
    bio: new FormControl('', { nonNullable: true })
  });

  readonly passwordForm = new FormGroup({
    currentPassword: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    newPassword: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
    confirmPassword: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

  constructor(
    public readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.profileForm.patchValue({
        name: user.name,
        email: user.email,
        avatar: user.avatar || '',
        bio: user.bio || ''
      });
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid) return;

    this.isSaving.set(true);
    this.successMessage.set(null);
    this.errorMessage.set(null);

    const values = this.profileForm.getRawValue();

    this.userService.updateProfile(values).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (updatedUser) => {
        this.authService.currentUser.set(updatedUser);
        this.successMessage.set('Profile updated successfully!');
        this.isSaving.set(false);
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Failed to update profile. Please try again.');
        this.isSaving.set(false);
      }
    });
  }

  getAvatarInitials(): string {
    const name = this.profileForm.value.name || this.authService.currentUser()?.name || '';
    if (!name) return 'U';
    return name.substring(0, 2).toUpperCase();
  }

  onPasswordSubmit(): void {
    if (this.passwordForm.invalid) return;

    const { currentPassword, newPassword, confirmPassword } = this.passwordForm.getRawValue();

    if (newPassword !== confirmPassword) {
      this.passwordErrorMessage.set('New passwords do not match');
      return;
    }

    this.isSavingPassword.set(true);
    this.passwordSuccessMessage.set(null);
    this.passwordErrorMessage.set(null);

    this.userService.changePassword({ currentPassword, newPassword }).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        this.passwordSuccessMessage.set('Password updated successfully!');
        this.passwordForm.reset();
        this.isSavingPassword.set(false);
        setTimeout(() => this.passwordSuccessMessage.set(null), 3000);
      },
      error: (err) => {
        this.passwordErrorMessage.set(err.error?.message || 'Failed to update password. Please check your credentials.');
        this.isSavingPassword.set(false);
      }
    });
  }
}
