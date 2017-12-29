import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Location } from '@angular/common';
import { MemberService } from './../shared/member.service';

@Component({
  selector: 'app-member-form',
  templateUrl: './member-form.component.html',
  styleUrls: ['./member-form.component.css']
})
export class MemberFormComponent implements OnInit {

  pickedMemberRole: string;
  roles: any;

  constructor(
  	private location: Location,
  	private memberService: MemberService
  	) { }

  ngOnInit() {
    this.roles = this.memberService.getRoles();
  }

  onSubmit(newMemberForm: NgForm) {
  	this.memberService.createMember(newMemberForm);
  }

  goBack(): void {
    this.location.back();
  }
}