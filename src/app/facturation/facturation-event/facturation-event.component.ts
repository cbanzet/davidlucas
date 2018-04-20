import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { FormControl } from '@angular/forms';

import { FacturationService } from './../shared/facturation.service';
import { ClientService } from './../../clients/shared/client.service';
import { MemberService } from './../../members/shared/member.service';
import { PrestationService } from './../../prestations/shared/prestation.service';

import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-facturation-event',
  templateUrl: './facturation-event.component.html',
  styleUrls: ['./facturation-event.component.css']
})
export class FacturationEventComponent implements OnInit {

  getEvent;eventkey;
  priceEvent: Observable<any>;
  // priceEvent: number;  
  moyenDePaiement;

  selectedQty:number=1;
  billready:boolean=false;

  totalEventHT: number;
  totalHT: number=0;
  totalTAX: number=0;
  totalTTC: number=0;

  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    private location: Location, 	
  	private clientService: ClientService,
  	private memberService: MemberService,
  	private prestationService: PrestationService,  	  	     
  	private facturationService: FacturationService     
  ) { }


  getTotalTAX(px) {
  	this.totalTAX = Math.round((this.selectedQty*px*0.2)*100)/100;    
    // this.totalTAX = Math.round((this.selectedPrice*this.selectedQty*0.2)*100)/100;    
  }
  getTotalHT(px) {
  	this.totalHT = Math.round((this.selectedQty*px)*100)/100;    
    // this.totalHT = Math.round(this.selectedPrice*this.selectedQty*100)/100;
  }
  getTotalTTC() {
    this.totalTTC = this.totalTAX + this.totalHT;
  }
  sumTablePrice(px) {
    this.getTotalHT(px);
    this.getTotalTAX(px);
    this.getTotalTTC();
    this.billready=true;
  }

  ngOnInit() {
    // GET KEY FROM URL AND SAVE IT TO EVENTKEY
    this.route.params.subscribe((params: Params) => {
        this.eventkey = params['eventid'];
        console.log(this.eventkey);
    });

    this.getEvent = this.facturationService.getDataWithEventKey(this.eventkey);
    this.priceEvent = this.facturationService.getEventPrice(this.eventkey);
    this.sumTablePrice;
    // this.totalHT = this.priceEvent.val();


  }

  changeQty(n) {
    this.selectedQty = this.selectedQty + n;
    this.sumTablePrice(this.totalEventHT);
  }

  getPriceNumber(n:number) {
  	console.log(n);
  	this.totalEventHT = n;
  	this.sumTablePrice(this.totalEventHT);
  }


  getBill(eventkey,event) {
  	// console.log(date,clientkey,coiffeurkey,prestationkey)
    // var event = this.getEvent?this.getEvent:0;
    var moyenDePaiement = this.moyenDePaiement?this.moyenDePaiement:"";

    // this.facturationService.createEventFacture(
    //   eventkey,event,moyenDePaiement,
    //   this.totalHT,this.totalTAX,this.totalTTC);        
  }

  goBack(): void {
    this.location.back();
  }  

}
