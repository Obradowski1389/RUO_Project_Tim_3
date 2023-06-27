import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareDataDialogComponent } from './share-data-dialog.component';

describe('ShareDataDialogComponent', () => {
  let component: ShareDataDialogComponent;
  let fixture: ComponentFixture<ShareDataDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareDataDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShareDataDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
