import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  template: `
    <div class="flex text-amber-500">
      @for (star of stars(); track $index) {
        <svg [class]="sizeClass()" [class.fill-current]="star === 1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.906a1 1 0 00.95-.69l1.519-4.674z" />
        </svg>
      }
    </div>
  `
})
export class StarRatingComponent {
  readonly rating = input<number>(0);
  readonly size = input<'xs' | 'sm' | 'md' | 'lg'>('sm');

  readonly stars = computed(() => {
    const rounded = Math.round(this.rating());
    const list = [];
    for (let i = 1; i <= 5; i++) {
      list.push(i <= rounded ? 1 : 0);
    }
    return list;
  });

  readonly sizeClass = computed(() => {
    switch (this.size()) {
      case 'xs': return 'w-3 h-3';
      case 'sm': return 'w-3.5 h-3.5';
      case 'md': return 'w-4 h-4';
      case 'lg': return 'w-5 h-5';
      default: return 'w-3.5 h-3.5';
    }
  });
}
