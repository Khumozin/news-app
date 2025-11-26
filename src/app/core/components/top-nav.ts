import { ChangeDetectionStrategy, Component } from '@angular/core';
import ThemeToggleComponent from './theme-toggle';
import { version } from '../../../../package.json';

@Component({
  selector: 'app-top-nav',
  imports: [ThemeToggleComponent],
  template: `
    <nav
      class="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div
        class="container flex h-16 items-center justify-between px-4 md:px-6">
        <div class="flex items-center gap-2">
          <h1 class="text-2xl font-bold text-foreground">News App</h1>
          <span
            class="text-xs text-muted-foreground font-medium px-2 py-1 rounded-md bg-muted">
            v{{ version }}
          </span>
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
export default class TopNavComponent {
  protected readonly version = version;
}
