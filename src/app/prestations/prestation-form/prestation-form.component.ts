import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { FormControl } from '@angular/forms';

// import {MatChipInputEvent} from '@angular/material';
// import {ENTER, COMMA} from '@angular/cdk/keycodes';

import { PrestationService } from './../shared/prestation.service';

@Component({
  selector: 'app-prestation-form',
  templateUrl: './prestation-form.component.html',
  styleUrls: ['./prestation-form.component.css']
})
export class PrestationFormComponent implements OnInit {

	addPrestation = true;
	addPrestations = false;
  times = ['15','30','45','60'];
	services: Observable<any[]>;
  salons: Observable<any[]>;

  panelOpenState: boolean = false;
  
  prestatypes: Observable<any[]>;
  selectedTypes: Observable<any[]>;

  savedSelectTypes: any;

  selectTypesColors = [
    { name: 'none', color: '', selected:true },
    { name: 'Primary', color: 'primary', selected:false },
  ];


  constructor(private router: Router,
              private location: Location,
  						private prestationService: PrestationService) { 
    this.salons = this.prestationService.getSalonsList();
    // this.prestatypes = this.prestationService.getPrestaTypeList();
    this.prestatypes = this.prestationService.getPrestaTypeNameList();
  }

  ngOnInit() {
  }

  onSubmit(newPrestaForm: NgForm) {
    // console.log(newPrestaForm.value);
  	this.prestationService.createPrestation(newPrestaForm);
  }   

 
  goBack(): void {
    this.location.back();
  }


}
