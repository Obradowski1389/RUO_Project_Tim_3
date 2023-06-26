import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilySignUpComponent } from './family-sign-up.component';

describe('FamilySignUpComponent', () => {
  let component: FamilySignUpComponent;
  let fixture: ComponentFixture<FamilySignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FamilySignUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FamilySignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
