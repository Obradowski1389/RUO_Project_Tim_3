import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddModifyComponent } from './add-modify.component';

describe('AddModifyComponent', () => {
  let component: AddModifyComponent;
  let fixture: ComponentFixture<AddModifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddModifyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
