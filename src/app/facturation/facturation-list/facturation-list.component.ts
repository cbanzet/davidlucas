import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { FacturationService } from './../shared/facturation.service';
import { MemberService } from './../../members/shared/member.service';

@Component({
  selector: 'app-facturation-list',
  templateUrl: './facturation-list.component.html',
  styleUrls: ['./facturation-list.component.css']
})
export class FacturationListComponent implements OnInit {

	factures: Observable<any[]>;
  members : Observable<any[]>;
  total:number = 0;
  check: string = "Check : ";

  constructor(
		private router: Router,
    private location: Location,
    private memberService: MemberService,
    private facturationService: FacturationService) { }

  ngOnInit() {
  	this.factures = this.facturationService.getFacturesList();  	  	
    this.members = this.memberService.getMembersList();    
  }

  addToTotal(key:string, price:number):void {
    if (this.check.indexOf(key) == -1) {
      this.check = `${this.check} ${key}`;
      console.log("key added");
      this.total += price;
    }
  }

  changeFactureStatut(facture) {
    this.facturationService.changeFactureStatut(facture);	
  }

  deleteFacture(facture) {
    this.facturationService.deleteFacture(facture);
  } 



}