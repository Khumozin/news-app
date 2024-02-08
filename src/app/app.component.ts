import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <mat-toolbar class="shadow-xl">
      <span class="text-4xl">News App</span>
    </mat-toolbar>

    <router-outlet />
  `,
  styles: [
    `
      mat-toolbar {
        height: 120px;
        display: flex;
        justify-content: center;
      }
    `,
  ],
  standalone: true,
  imports: [MatToolbarModule, RouterOutlet],
})
export class AppComponent {}
