import { Component, OnInit } from '@angular/core';

import { ForfaitService } from './../../forfaits/shared/forfait.service';
import { PrestationService } from './../../prestations/shared/prestation.service';

@Component({
  selector: 'app-cart-form',
  templateUrl: './cart-form.component.html',
  styleUrls: ['./cart-form.component.css']
})
export class CartFormComponent implements OnInit {

	prestations: any;

	showAddPrestaSection:boolean=false;
	showAddPrestaSectionButton:boolean=true;
	showRemovePrestaSectionButton:boolean=false;


  constructor(private prestationService: PrestationService) 
  {
  	this.prestations = this.prestationService.getPrestationsList();
  }

  ngOnInit() {
  }

}
