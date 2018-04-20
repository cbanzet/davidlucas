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
  prestaData: Array<any> = [];
  panelOpenState: boolean = false;
  showAddTypeButton:boolean = true;
  prestatypes: Observable<any[]>;
  forfaitTypes: Observable<any[]>;  
  selectedPrestations: Observable<any[]>;
  savedSelectTypes: any;
  prestations: Observable<any[]>;

  constructor( private router: Router,
    private location: Location,
    private forfaitService: ForfaitService ) {
      this.forfaitTypes = this.forfaitService.getForfaitTypeList();
      this.prestations = this.forfaitService.getPrestaTypeSnapshotList();
   }

  ngOnInit() {
  }

  onSubmit(newForfaitForm: NgForm, data ) {
    this.forfaitService.createForfait(newForfaitForm, data);
  }

  goBack(): void {
    this.location.back();
  }


  insertInPrestaData(prestation) {
    let item = this.prestaData.find((Obj) =>  Obj.title ===  prestation.title);
    console.log(item);
    if (item === undefined) {
      this.prestaData.push(prestation);
    }
  }

  removePresta(index:number, prestation) {
    this.prestaData.splice(index, 1);
  }
}