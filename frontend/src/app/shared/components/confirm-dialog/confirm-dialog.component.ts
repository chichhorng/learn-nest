import { Component, inject } from '@angular/core';
import { ConfirmService } from './confirm.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  template: `
    @if (confirmService.isOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div class="bg-card border border-border rounded-xl shadow-xl max-w-md w-full overflow-hidden p-6 space-y-6 transform scale-100 transition-all duration-300 animate-in zoom-in-95">
          <div class="flex items-start gap-4">
            <!-- Icon based on type -->
            <div [class]="iconBgClass()" class="w-10 h-10 rounded-full flex items-center justify-center shrink-0">
              @if (confirmService.options().type === 'danger') {
                <svg class="w-5 h-5 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              } @else if (confirmService.options().type === 'warning') {
                <svg class="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              } @else {
                <svg class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            </div>
            
            <div class="space-y-1.5 flex-1">
              <h3 class="text-lg font-bold text-foreground">{{ confirmService.options().title }}</h3>
              <p class="text-sm text-muted-foreground leading-relaxed">{{ confirmService.options().message }}</p>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-2">
            <button
              (click)="confirmService.decline()"
              class="px-4 py-2 text-sm font-semibold border border-input bg-background hover:bg-accent text-foreground rounded-lg transition-all cursor-pointer"
            >
              {{ confirmService.options().cancelText }}
            </button>
            <button
              (click)="confirmService.approve()"
              [class]="confirmButtonClass()"
              class="px-4 py-2 text-sm font-semibold text-primary-foreground rounded-lg transition-all cursor-pointer"
            >
              {{ confirmService.options().confirmText }}
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class ConfirmDialogComponent {
  readonly confirmService = inject(ConfirmService);

  iconBgClass(): string {
    const type = this.confirmService.options().type;
    if (type === 'danger') return 'bg-destructive/10';
    if (type === 'warning') return 'bg-amber-500/10';
    return 'bg-primary/10';
  }

  confirmButtonClass(): string {
    const type = this.confirmService.options().type;
    if (type === 'danger') return 'bg-destructive hover:bg-destructive/90';
    if (type === 'warning') return 'bg-amber-500 hover:bg-amber-600';
    return 'bg-primary hover:bg-primary/90';
  }
}
