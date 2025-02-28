import { ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { SkeletonRectComponent } from './skeleton-rect.component';

describe('SkeletonRectComponent', () => {
  let component: SkeletonRectComponent;
  let fixture: ComponentFixture<SkeletonRectComponent>;
  //   let elementRef: ElementRef<HTMLElement>;

  beforeEach(() => {
    const mockElementRef = {
      nativeElement: {
        classList: {
          add: (...args: string[]) => {
            args;
          },
        },
        style: {
          setProperty: (
            property: string,
            value: string | null,
            priority?: string | undefined
          ) => {
            property;
            value;
            priority;
          },
        },
      },
    };

    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, SkeletonRectComponent],
      providers: [
        {
          provide: ElementRef,
          useValue: mockElementRef,
        },
      ],
    });
    fixture = TestBed.createComponent(SkeletonRectComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
