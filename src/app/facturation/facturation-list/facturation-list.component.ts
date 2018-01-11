import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { FacturationService } from './../shared/facturation.service';

@Component({
  selector: 'app-facturation-list',
  templateUrl: './facturation-list.component.html',
  styleUrls: ['./facturation-list.component.css']
})
export class FacturationListComponent implements OnInit {

	factures: Observable<any[]>;

  constructor(
		private router: Router,
    private location: Location,
    private facturationService: FacturationService) { }

  ngOnInit() {
  	this.factures = this.facturationService.getFacturesList();  	  	
  }

  changeFactureStatus(facture) {
    // console.log(facture);
    this.facturationService.changeFactureStatus(facture);	
  }

  deleteFacture(facture) {
    this.facturationService.deleteFacture(facture);
  } 

}