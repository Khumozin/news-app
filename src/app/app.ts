import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopNav } from './core/components/top-nav';

@Component({
  selector: 'app-root',
  imports: [TopNav, RouterOutlet],
  template: `
    <app-top-nav />
    <router-outlet />
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
