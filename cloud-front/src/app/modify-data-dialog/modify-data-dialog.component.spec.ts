import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyDataDialogComponent } from './modify-data-dialog.component';

describe('ModifyDataDialogComponent', () => {
  let component: ModifyDataDialogComponent;
  let fixture: ComponentFixture<ModifyDataDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyDataDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifyDataDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
