import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div class="p-8 bg-card border border-border rounded-2xl shadow-lg max-w-md w-full space-y-6">
        <div class="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto border border-primary/20">
          <span class="text-3xl font-black">404</span>
        </div>
        
        <div class="space-y-2">
          <h1 class="text-2xl font-extrabold text-foreground">Page Not Found</h1>
          <p class="text-sm text-muted-foreground leading-relaxed">
            The page you are looking for doesn't exist or may have been moved to another location.
          </p>
        </div>

        <div class="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            routerLink="/"
            class="px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl text-sm transition-all shadow-sm"
          >
            Back to Home
          </a>
          <a
            routerLink="/courses"
            class="px-5 py-2.5 border border-input hover:bg-accent text-foreground font-semibold rounded-xl text-sm transition-all"
          >
            Browse Courses
          </a>
        </div>
      </div>
    </div>
  `
})
export class NotFoundComponent {}
