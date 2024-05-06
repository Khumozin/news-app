import { Directive, effect, input, TemplateRef, ViewContainerRef } from '@angular/core';

import { SkeletonRectComponent } from '../components';

function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

@Directive({
  selector: '[skeleton]',
  standalone: true,
})
export class SkeletonDirective {
  isLoading = input<boolean>(false, { alias: 'skeleton' });
  repeat = input<number>(1, { alias: 'skeletonRepeat' });
  width = input<string>('', { alias: 'skeletonWidth' });
  height = input<string>('', { alias: 'skeletonHeight' });
  className = input<string>('', { alias: 'skeletonClassName' });

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef
  ) {
    effect(() => {
      this.viewContainerRef.clear();

      if (!this.isLoading()) {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
        return;
      }

      Array.from({ length: this.repeat() }).forEach(() => {
        const ref = this.viewContainerRef.createComponent(
          SkeletonRectComponent
        );

        Object.assign(ref.instance, {
          width: this.width() === 'rand' ? `${random(30, 90)}%` : this.width(),
          height: this.height(),
          className: this.className(),
        });
      });
    });
  }
}
