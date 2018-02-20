import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ForfaitService } from './../shared/forfait.service';
import {MatChipInputEvent} from '@angular/material';
import {ENTER, COMMA} from '@angular/cdk/keycodes';
import { Router, ActivatedRoute, Params, ParamMap } from '@angular/router';

@Component({
  selector: 'app-forfait-list',
  templateUrl: './forfait-list.component.html',
  styleUrls: ['./forfait-list.component.css']
})
export class ForfaitListComponent implements OnInit {

  forfaits: Observable<any[]>;
  oldforfaits: Observable<any[]>;
  listForfaits:Observable<any[]>;//
  listprestation:Observable<any[]>;//

  titleField = "title";
  prestationField = "prestation";
  timeField = "time";
  priceField = "price";
  
  visible: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = true;
  separatorKeysCodes = [ENTER, COMMA];

  add(event: MatChipInputEvent): void {
    let input = event.input;
    let value = event.value;

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  constructor(private forfaitService: ForfaitService, private route: ActivatedRoute)
  {
    this.forfaits = this.forfaitService.getForfaitsList();
    // console.log(this.prestations);
  }

  ngOnInit() {

  }

  deleteForfait(forfait) {
  	this.forfaitService.deleteForfait(forfait);
  }

  updateField(key,field,value) {
    this.forfaitService.updateForfait(key,field,value);
  }

}