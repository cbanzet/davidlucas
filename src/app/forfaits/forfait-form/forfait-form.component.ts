import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { FormControl } from '@angular/forms';

import { ForfaitService } from './../shared/forfait.service';

@Component({
  selector: 'app-forfait-form',
  templateUrl: './forfait-form.component.html',
  styleUrls: ['./forfait-form.component.css']
})
export class ForfaitFormComponent implements OnInit {

 
  addForfait = true;
  addPrestations = false;
  showPrestaList1 = false;
  showPrestaList2 = false;
  showPrestaList3 = false;
  showPrestaList4 = false;
  showPrestaList5 = false;
  times = ['15','30','45','60'];
  services: Observable<any[]>;
  salons: Observable<any[]>;

  panelOpenState: boolean = false;
  
  prestatypes: Observable<any[]>;

  selectedPrestations: Observable<any[]>;

  savedSelectTypes: any;
  prestations: Observable<any[]>;

  selectTypesColors = [
    { name: 'none', color: '', selected:true },
    { name: 'Primary', color: 'primary', selected:false },
  ];

  nombrePrestations = [
    {key: '2', title: '2 prestations'},
    {key: '3', title: '3 prestations'},
    {key: '4', title: '4 prestations'},
    {key: '5', title: '5 prestations'},
  ];

  constructor( private router: Router,
    private location: Location,
    private forfaitService: ForfaitService ) {
      this.prestations = this.forfaitService.getPrestaTypeSnapshotList();
    }

  ngOnInit() {
  }

  onSubmit(newForfaitForm: NgForm) {
  	this.forfaitService.createForfait(newForfaitForm);
  }

  goBack(): void {
    this.location.back();
  }

 activateInstrument(roleKey: number) {
  if(roleKey==2) {
     this.showPrestaList1 = true;
     this.showPrestaList2 = false;
     this.showPrestaList3 = false;
     this.showPrestaList4 = false;
     this.showPrestaList5 = false;
    }
  else if(roleKey==3) { 
    this.showPrestaList2 = true;
    this.showPrestaList1 = false;
    this.showPrestaList3 = false;
    this.showPrestaList4 = false;
    this.showPrestaList5 = false;
  }
  else if(roleKey==4) { 
    this.showPrestaList3 = true;
    this.showPrestaList2 = false;
    this.showPrestaList1 = false;
    this.showPrestaList4 = false;
    this.showPrestaList5 = false;
  }
  else if(roleKey==5) { 
    this.showPrestaList4 = true;
    this.showPrestaList2 = false;
    this.showPrestaList1 = false;
    this.showPrestaList5 = false;
    this.showPrestaList3 = false;
  }
  else { 
    this.showPrestaList5 = true;
    this.showPrestaList2 = false;
    this.showPrestaList1 = false;
    this.showPrestaList4 = false;
    this.showPrestaList3 = false;
  }
}  
}