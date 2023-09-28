import { Component, TemplateRef, ViewContainerRef } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { SkeletonDirective } from './skeleton.directive';

@Component({
  template: `<div
    *skeleton="isLoading; repeat: 3; width: 'rand'; className: 'rounded-sm'"
  ></div>`,
})
class TestComponent {
  isLoading = true;
}

describe('SkeletonDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let vcr: ViewContainerRef;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let tr: TemplateRef<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, SkeletonDirective],
      providers: [ViewContainerRef, TemplateRef],
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;

    vcr = TestBed.inject(ViewContainerRef);
    tr = TestBed.inject(TemplateRef);

    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = new SkeletonDirective(tr, vcr);
    expect(directive).toBeTruthy();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });
});

describe('SkeletonDirective - Negative Tests', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let vcr: ViewContainerRef;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let tr: TemplateRef<any>;

  beforeEach(() => {
    const viewContainerRefSpy = jasmine.createSpyObj('ViewContainerRef', [
      'createComponent',
      'clear',
      'createEmbeddedView',
    ]);

    TestBed.configureTestingModule({
      declarations: [TestComponent, SkeletonDirective],
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
    component.isLoading = true;

    fixture.detectChanges();

    component.isLoading = false;

    fixture.detectChanges();

    tick(100);

    expect(tr).toBeTruthy();
    expect(vcr).toBeTruthy();
  }));
});
