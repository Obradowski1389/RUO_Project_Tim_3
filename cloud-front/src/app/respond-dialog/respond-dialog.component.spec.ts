import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RespondDialogComponent } from './respond-dialog.component';

describe('RespondDialogComponent', () => {
  let component: RespondDialogComponent;
  let fixture: ComponentFixture<RespondDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RespondDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RespondDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
