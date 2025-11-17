import { ChangeDetectionStrategy, Component } from '@angular/core';
import ThemeToggleComponent from './theme-toggle';

@Component({
  selector: 'app-top-nav',
  imports: [ThemeToggleComponent],
  template: `
    <nav
      class="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur supports-backdrop-filter:bg-white/80 dark:supports-backdrop-filter:bg-gray-950/80">
      <div
        class="container flex h-16 items-center justify-between px-4 md:px-6">
        <div class="flex items-center gap-2">
          <h1
            class="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 dark:from-foreground dark:to-foreground bg-clip-text text-transparent">
            News App
          </h1>
        </div>

        <div class="flex items-center gap-2">
          <app-theme-toggle />
        </div>
      </div>
    </nav>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TopNavComponent {}
