import { Directive, Input, OnChanges, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';

import { SkeletonRectComponent } from '../components';

function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

@Directive({
  selector: '[skeleton]',
})
export class SkeletonDirective implements OnChanges {
  @Input('skeleton') isLoading = false;
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('skeletonRepeat') size = 1;
  @Input('skeletonWidth') width!: string;
  @Input('skeletonHeight') height!: string;
  @Input('skeletonClassName') className!: string;

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isLoading']) {
      this.viewContainerRef.clear();

      if (changes['isLoading'].currentValue) {
        Array.from({ length: this.size }).forEach(() => {
          const ref = this.viewContainerRef.createComponent(
            SkeletonRectComponent
          );

          Object.assign(ref.instance, {
            width: this.width === 'rand' ? `${random(30, 90)}%` : this.width,
            height: this.height,
            className: this.className,
          });
        });
      } else {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      }
    }
  }
}
