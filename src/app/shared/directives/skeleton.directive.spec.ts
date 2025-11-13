import { Component, signal } from '@angular/core';
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestComponent, SkeletonDirective],
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });
});

describe('SkeletonDirective - Negative Tests', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestComponent, SkeletonDirective],
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should toggle loading state', fakeAsync(() => {
    component.isLoading.set(true);

    fixture.detectChanges();

    component.isLoading.set(false);

    fixture.detectChanges();

    tick(100);

    expect(component).toBeTruthy();
  }));
});
