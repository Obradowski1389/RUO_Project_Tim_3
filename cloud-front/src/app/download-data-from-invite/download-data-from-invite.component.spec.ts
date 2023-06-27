import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadDataFromInviteComponent } from './download-data-from-invite.component';

describe('DownloadDataFromInviteComponent', () => {
  let component: DownloadDataFromInviteComponent;
  let fixture: ComponentFixture<DownloadDataFromInviteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadDataFromInviteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadDataFromInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
