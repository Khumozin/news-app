import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkeletonRectComponent } from './components';
import { SkeletonDirective } from './directives';

@NgModule({
  declarations: [SkeletonDirective, SkeletonRectComponent],
  imports: [CommonModule],
  exports: [SkeletonDirective, SkeletonRectComponent],
})
export class SharedModule {}
