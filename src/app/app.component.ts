import { Component } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <mat-toolbar class="shadow-xl">
      <span>News App</span>
    </mat-toolbar>

    <router-outlet></router-outlet>
  `,
  styles: [
    `
      mat-toolbar {
        height: 120px;

        display: flex;
        justify-content: center;

        span {
          font-size: 36px;
        }
      }
    `,
  ],
  standalone: true,
  imports: [MatToolbarModule, MatSnackBarModule, RouterOutlet],
})
export class AppComponent {}
