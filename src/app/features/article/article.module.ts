import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SharedModule } from 'src/app/shared/shared.module';

import { ArticleRoutingModule } from './article-routing.module';
import { ArticleComponent } from './components';
import { ArticlesComponent } from './pages/articles/articles.component';

@NgModule({
  declarations: [ArticleComponent, ArticlesComponent],
  imports: [
    CommonModule,
    ArticleRoutingModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatIconModule,
    MatNativeDateModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatSelectModule,
    SharedModule,
  ],
})
export class ArticleModule {}
