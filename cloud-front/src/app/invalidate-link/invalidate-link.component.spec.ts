import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvalidateLinkComponent } from './invalidate-link.component';

describe('InvalidateLinkComponent', () => {
  let component: InvalidateLinkComponent;
  let fixture: ComponentFixture<InvalidateLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvalidateLinkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvalidateLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
