import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { FormsModule } from '@angular/forms';

import { ForfaitService } from './../shared/forfait.service';
import { Type } from '../../prestations/shared/type';


// our root app component
import { NgModule, VERSION} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import { ReactiveFormsModule} from '@angular/forms';


@Component({
  selector: 'app-forfait-detail',
  templateUrl: './forfait-detail.component.html',
  styleUrls: ['./forfait-detail.component.css']
})
export class ForfaitDetailComponent implements OnInit {

  forfait: Observable<any>;
  prestations: Observable<any>;
  salons: Observable<any[]>;
  prestatypes: Observable<any[]>;
  listprestation: Observable<any>;

  titleField = "title";
  prestationField = "prestation";
  timeField = "time";
  priceField = "price";
 

  listpre: Observable<any[]>;


  constructor(
  	private forfaitService: ForfaitService,
  	private route: ActivatedRoute,
  	private router: Router,
  	private location: Location) 
  {
  }

  ngOnInit() {
    this.prestations = this.forfaitService.getPrestationsList() ;
  	this.forfait = this.route.paramMap
  		.switchMap((params: ParamMap)=>
        this.forfaitService.getPrestationWithKey(params.get('id')));
        
      
  }

  shit(time:number,prestatime:number) {
    console.log(time,prestatime);
  }

  goBack(): void {
  	this.location.back();
	}

	updateField(key,field,value) {
		this.forfaitService.updateForfait(key,field,value);
	}


  deleteForever(prestation) {
    this.forfaitService.deleteForfait(prestation);
  }

  // let user = { role:'administrator', status:10, tries:2, }; let arr = []; 
  // for(let key in user){ if(user.hasOwnProperty(key))
  //   { arr.push(user[key]); } } console.log(arr);

  compareFn(t1: Type, t2: Type): boolean {
     return t1 && t2 ? t1.key === t2.key : t1 === t2;
    // return t1.title == 'Coupe Femme';
  }

}