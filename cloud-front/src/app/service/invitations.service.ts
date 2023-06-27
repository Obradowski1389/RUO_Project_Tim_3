import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IInvitation } from 'src/model/invitation';

@Injectable({
  providedIn: 'root'
})
export class InvitationsService {

  constructor(private client: HttpClient) { }

  shareRepositoryInvitation(senderEmail: string, targetEmail: string, username: string) {
    return this.client.post<any>(environment.host + 'invite', { 'senderEmail': senderEmail, 'targetEmail': targetEmail, "username": username});
  }

  resolveInvite(userEmail: string, inviter: string, accept: boolean){
    return this.client.put<any>(environment.host + "resolveInvite", {"senderEmail": inviter, "targetEmail": userEmail, "accept": accept})
  }

  getInvitations(){
    const username: string = localStorage.getItem("username")!;

    return this.client.get<any>(environment.host + "getInvitations/"+username);
  }

  modifyInvitation(invitation: IInvitation, disapprove: boolean){
    return this.client.put<any>(environment.host+"modifyInvitation", {"senderUsername": invitation.senderUsername, "targetEmail": invitation.targetEmail, "revoke": disapprove})
  }
}
