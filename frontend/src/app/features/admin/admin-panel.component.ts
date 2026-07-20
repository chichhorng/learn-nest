import { Component, OnInit, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { SafeUser } from '../../core/models/user.model';
import { ConfirmService } from '../../shared/components/confirm-dialog/confirm.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './admin-panel.component.html'
})
export class AdminPanelComponent implements OnInit {
  readonly activeTab = signal<'activations' | 'users'>('activations');
  readonly pendingInstructors = signal<SafeUser[]>([]);
  readonly allUsers = signal<SafeUser[]>([]);
  readonly searchQuery = signal('');
  readonly isLoading = signal(true);
  readonly approvingId = signal<number | null>(null);
  readonly deletingId = signal<number | null>(null);

  readonly filteredUsers = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const users = this.allUsers();
    if (!query) return users;
    return users.filter(u => 
      u.name.toLowerCase().includes(query) || 
      u.email.toLowerCase().includes(query)
    );
  });

  constructor(
    private readonly userService: UserService,
    public readonly authService: AuthService,
    private readonly confirmService: ConfirmService
  ) {}

  ngOnInit(): void {
    this.loadPending();
    this.loadAllUsers();
  }

  loadPending(): void {
    this.isLoading.set(true);
    this.userService.getPendingInstructors().subscribe({
      next: (instructors) => {
        this.pendingInstructors.set(instructors);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  loadAllUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.allUsers.set(users);
      }
    });
  }

  setTab(tab: 'activations' | 'users'): void {
    this.activeTab.set(tab);
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  approve(id: number): void {
    this.approvingId.set(id);
    this.userService.approveInstructor(id).subscribe({
      next: () => {
        this.pendingInstructors.update(list => list.filter(u => u.id !== id));
        this.allUsers.update(list => list.map(u => u.id === id ? { ...u, isApproved: true } : u));
        this.approvingId.set(null);
      },
      error: () => {
        this.approvingId.set(null);
      }
    });
  }

  async deleteUser(id: number): Promise<void> {
    const confirmed = await this.confirmService.confirm({
      title: 'Delete User',
      message: 'Are you sure you want to permanently delete this user? This will delete all their data, including courses, reviews, and enrollments.',
      confirmText: 'Delete User',
      type: 'danger'
    });

    if (!confirmed) {
      return;
    }

    this.deletingId.set(id);
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.allUsers.update(list => list.filter(u => u.id !== id));
        this.pendingInstructors.update(list => list.filter(u => u.id !== id));
        this.deletingId.set(null);
      },
      error: () => {
        this.deletingId.set(null);
      }
    });
  }
}
