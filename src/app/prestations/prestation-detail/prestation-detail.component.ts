import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { FormsModule } from "@angular/forms";

import { PrestationService } from './../shared/prestation.service';
import { Type } from "./../shared/type";


@Component({
  selector: 'app-prestation-detail',
  templateUrl: './prestation-detail.component.html',
  styleUrls: ['./prestation-detail.component.css']
})
export class PrestationDetailComponent implements OnInit {

	prestation: Observable<any>;
  salons: Observable<any[]>;  
  prestatypes: Observable<any[]>;
  types: Observable<any[]>;

  titleField = "title";
  detailsField = "details";
  timeField = "time";
  priceDavidField = "priceDavid";
  priceTeamField = "priceTeam";
  acronymeField = "acronyme";

  times = ['15','30','45','60'];

  showAddTypeButton:boolean=true;

  constructor(
  	private prestationService: PrestationService,
  	private route: ActivatedRoute,
  	private router: Router,
  	private location: Location) 
  {
  }

  ngOnInit() {
    this.types = this.prestationService.getPrestaTypeList();    
    this.salons = this.prestationService.getSalonsList();    
  	this.prestation = this.route.paramMap
  		.switchMap((params: ParamMap)=>
  			this.prestationService.getPrestationWithKey(params.get('id')));
  }

  shit(time:number,prestatime:number) {
    console.log(time,prestatime);
  }

  goBack(): void {
  	this.location.back();
	}

	updateField(key,field,value) {
		this.prestationService.updatePrestation(key,field,value);
	}

  // compareFn(t1: Type, t2: Type): boolean {
  //   return t1 && t2 ? t1.key === t2.key : t1 === t2;
  // }

  addTypeToPresta(prestation,type) {
    this.prestationService.addTypeToPrestation(prestation,type);
  }

  deleteForever(prestation) {
    this.prestationService.deletePrestation(prestation);
  }	

  removeTypeFromPresta(prestation,typekey) {
    this.prestationService.removeTypeFromPresta(prestation,typekey);    
  }

}
