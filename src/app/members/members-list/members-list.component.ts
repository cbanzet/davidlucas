import { Component, OnInit, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MemberService } from './../shared/member.service';

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.css']
})
export class MembersListComponent implements OnInit {

  members: Observable<any[]>;

  constructor(private memberService: MemberService) 
  {
    this.members = this.memberService.getMembersList();
  }

  ngOnInit() {
  }

  deleteMember(member) {    
    this.memberService.deleteMember(member); 
  }

}
