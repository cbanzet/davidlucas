import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { PrestationService } from './../shared/prestation.service';

@Component({
  selector: 'app-prestation-list',
  templateUrl: './prestation-list.component.html',
  styleUrls: ['./prestation-list.component.css']
})
export class PrestationListComponent implements OnInit {

  prestations: Observable<any[]>;
  oldprestas: Observable<any[]>;

  titleField = "title";
  detailsField = "details";
  timeField = "time";
  priceDavidField = "priceDavid";
  priceTeamField = "priceTeam";
  acronymeField = "acronyme";

  constructor(private prestationService: PrestationService) 
  {
    this.prestations = this.prestationService.getPrestationsList();
    this.oldprestas = this.prestationService.getServicesList();
  }

  ngOnInit() {
  }

  migratePresta(prestas) {
  	this.prestationService.migratePresta(prestas);
  }

  deletePrestation(presta) {
  	this.prestationService.deletePrestation(presta);
  }

  updateField(key,field,value) {
    this.prestationService.updatePrestation(key,field,value);
  }

}