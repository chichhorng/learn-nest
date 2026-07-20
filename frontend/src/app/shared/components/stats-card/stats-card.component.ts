import { Component, input } from '@angular/core';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  template: `
    <div class="p-6 bg-card border border-border rounded-xl shadow-sm flex items-center gap-5">
      <div [class]="iconBgClass()" class="w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
        <ng-content select="[icon]"></ng-content>
      </div>
      <div>
        <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{{ title() }}</p>
        <div class="flex items-center gap-1.5 mt-0.5">
          <h3 class="text-2xl font-black text-foreground">{{ value() }}</h3>
          <ng-content select="[extra]"></ng-content>
        </div>
      </div>
    </div>
  `
})
export class StatsCardComponent {
  readonly title = input.required<string>();
  readonly value = input.required<string | number | null>();
  readonly color = input<'primary' | 'emerald' | 'amber'>('primary');

  readonly iconBgClass = () => {
    switch (this.color()) {
      case 'emerald': return 'bg-emerald-500/10 text-emerald-500';
      case 'amber': return 'bg-amber-500/10 text-amber-500';
      default: return 'bg-primary/10 text-primary';
    }
  };
}
