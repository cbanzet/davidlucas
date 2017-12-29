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

  constructor( private router: Router,
    private location: Location,
    private forfaitService: ForfaitService ) {

      this.prestations = this.forfaitService.getPrestaTypeSnapshotList();
      console.log(this.prestations);

    }

  ngOnInit() {
  }

  onSubmit(newForfaitForm: NgForm) {
  	this.forfaitService.createForfait(newForfaitForm);
  }

  goBack(): void {
    this.location.back();
  }
}