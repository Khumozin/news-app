import { ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { SkeletonRectComponent } from './skeleton-rect.component';

describe('SkeletonRectComponent', () => {
  let component: SkeletonRectComponent;
  let fixture: ComponentFixture<SkeletonRectComponent>;
  let elementRef: ElementRef<HTMLElement>;

  beforeEach(() => {
    const mockElementRef: any = {
      nativeElement: {
        classList: {
          add: (...args: any) => console.log(args),
        },
        style: {
          setProperty: (...args: any) => console.log(args),
        },
      },
    };

    TestBed.configureTestingModule({
      declarations: [SkeletonRectComponent],
      imports: [NoopAnimationsModule],
      providers: [
        {
          provide: ElementRef,
          useValue: mockElementRef,
        },
      ],
    });
    fixture = TestBed.createComponent(SkeletonRectComponent);
    component = fixture.componentInstance;

    elementRef = TestBed.inject(ElementRef<HTMLElement>);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //   it('should add className', () => {
  //     expect(component.className).toEqual('rounded-sm');
  //   });
});
