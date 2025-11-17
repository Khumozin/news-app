import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import TopNavComponent from './core/components/top-nav';

@Component({
  selector: 'app-root',
  template: `
    <app-top-nav />
    <router-outlet />
  `,
  styles: [],
  imports: [TopNavComponent, RouterOutlet],
})
export class AppComponent {}
