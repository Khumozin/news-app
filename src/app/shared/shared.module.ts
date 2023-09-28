import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkeletonRectComponent } from './components/skeleton-rect/skeleton-rect.component';
import { SkeletonDirective } from './directives/skeleton.directive';

@NgModule({
  declarations: [SkeletonDirective, SkeletonRectComponent],
  imports: [CommonModule],
  exports: [SkeletonDirective, SkeletonRectComponent],
})
export class SharedModule {}
