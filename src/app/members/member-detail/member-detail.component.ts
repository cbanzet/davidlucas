import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { FormsModule } from "@angular/forms";

import { MemberService } from './../shared/member.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {

	member: Observable<any>;

  firstnameField = "firstname";
  lastnameField = "lastname";
  emailField = "email";
  phoneField = "phone";
  streetField = "street";
  zipField = "zip";
  cityField = "city";
  birthdateField = "birthdate";
  fichetechniqueField = "fichetechnique";

  constructor(
  	private memberService: MemberService,
  	private route: ActivatedRoute,
    private router: Router,
  	private location: Location) 
  {}

  ngOnInit() {
    this.member = this.route.paramMap
      .switchMap((params: ParamMap) =>
        this.memberService.getMemberWithKey(params.get('id')));  	
  }

  goBack(): void {
  	this.location.back();
	}

	updateField(key,field,value) {
		this.memberService.updateMember(key,field,value);
	}

  deleteForever(member) {
    this.memberService.deleteMember(member);
  }

}
