import { Component, EventEmitter, Output } from '@angular/core';
import { IInvitation } from 'src/model/invitation';
import { FileService } from '../service/file.service';
import { InvitationsService } from '../service/invitations.service';
import { error } from 'console';

@Component({
  selector: 'app-invitations',
  templateUrl: './invitations.component.html',
  styleUrls: ['./invitations.component.css']
})
export class InvitationsComponent {
  @Output() buttonClicked = new EventEmitter<void>()

  invitations : IInvitation[] = []

  close(){
    this.buttonClicked.emit();
  }

  constructor(private invitationsService: InvitationsService, private fileService: FileService){
    invitationsService.getInvitations().subscribe({
      next: (value: IInvitation[]) => {
        this.invitations = value;
        console.log(value);
      },
      error: (error: any) => {
        console.log(error.error);
      }
    })
  }

  disapprove(invitation: IInvitation) {
    this.invitationsService.modifyInvitation(invitation, true).subscribe({
      next: (value: any) => {
        invitation.status="REVOKED";
        console.log(value);
        this.fileService.sendNotification(invitation.targetEmail, "Your right to access family content has been revoked.").subscribe({
          next: (val: any) => {
            console.log(val);
          },
          error: (error: any) => {
            console.log(error.error);
          }
        })
        
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }

  reapprove(invitation: IInvitation) {
    this.invitationsService.modifyInvitation(invitation, false).subscribe({
      next: (value: any) => {
        invitation.status = "ACCEPTED";
        console.log(value);

        this.fileService.sendNotification(invitation.targetEmail, "Your right to access family content has been restored.").subscribe({
          next: (val: any) => {
            console.log(val);
          },
          error: (error: any) => {
            console.log(error.error);
          }
        })
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }

}
