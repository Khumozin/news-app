import {
  Component,
  signal,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { SkeletonDirective } from './skeleton.directive';

/* eslint-disable @typescript-eslint/no-explicit-any */
@Component({
  template: `<div
      *skeleton="
        isLoading();
        repeat: 3;
        width: 'rand';
        className: 'rounded-sm'
      "></div>

    <div *skeleton="isLoading(); repeat: 3; className: 'rounded-sm'"></div>`,
  imports: [SkeletonDirective],
})
class TestComponent {
  isLoading = signal<boolean>(true);
}

describe('SkeletonDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let vcr: ViewContainerRef;
  let tr: TemplateRef<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestComponent, SkeletonDirective],
      providers: [ViewContainerRef, TemplateRef],
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;

    vcr = TestBed.inject(ViewContainerRef);
    tr = TestBed.inject(TemplateRef);

    fixture.detectChanges();
  });

  it('should create an instance', () => {
    // fixes effect(() => ...) issue
    TestBed.runInInjectionContext(() => {
      const directive = new SkeletonDirective(tr, vcr);
      expect(directive).toBeTruthy();
    });
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });
});

describe('SkeletonDirective - Negative Tests', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let vcr: ViewContainerRef;
  let tr: TemplateRef<any>;

  beforeEach(() => {
    const viewContainerRefSpy = jasmine.createSpyObj('ViewContainerRef', [
      'createComponent',
      'clear',
      'createEmbeddedView',
    ]);

    TestBed.configureTestingModule({
      imports: [TestComponent, SkeletonDirective],
      providers: [
        {
          provide: ViewContainerRef,
          useValue: viewContainerRefSpy,
        },
        TemplateRef,
      ],
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;

    vcr = TestBed.inject(ViewContainerRef);
    tr = TestBed.inject(TemplateRef);

    fixture.detectChanges();
  });

  it('should call something', fakeAsync(() => {
    component.isLoading.set(true);

    fixture.detectChanges();

    component.isLoading.set(false);

    fixture.detectChanges();

    tick(100);

    expect(tr).toBeTruthy();
    expect(vcr).toBeTruthy();
  }));
});
