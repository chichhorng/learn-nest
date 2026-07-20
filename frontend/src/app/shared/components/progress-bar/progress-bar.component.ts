import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  template: `
    <div class="w-full h-2 bg-muted rounded-full overflow-hidden border border-border/60">
      <div
        [style.width.%]="progress()"
        [class]="colorClass()"
        class="h-full rounded-full transition-all duration-300"
      ></div>
    </div>
  `
})
export class ProgressBarComponent {
  readonly progress = input<number>(0);
  readonly color = input<'primary' | 'emerald'>('primary');

  readonly colorClass = computed(() => {
    return this.color() === 'emerald' ? 'bg-emerald-500' : 'bg-primary';
  });
}
