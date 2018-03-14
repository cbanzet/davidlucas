import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Prestation} from './../shared/prestation';
import { Type } from './../shared/type';

import { PrestationService } from './../shared/prestation.service';

@Component({
  selector: 'app-prestation-list',
  templateUrl: './prestation-list.component.html',
  styleUrls: ['./prestation-list.component.css']
})
export class PrestationListComponent implements OnInit {

  prestations: Observable<any[]>;
  types: Observable<any[]>;

  typelist: Observable<any[]>;

  typeShow:any;

  titleField = "title";
  detailsField = "details";
  timeField = "time";
  priceDavidField = "priceDavid";
  priceTeamField = "priceTeam";
  acronymeField = "acronyme";

  ShowAddTypeBut:boolean = true;
  showTypeSelect:boolean = false;
  showPrestaTypeList:boolean = true;
  typeselected: string ;
  filtre: Object;

  constructor(private prestationService: PrestationService) 
  {
    this.prestations = this.prestationService.getPrestationsList();
    // this.types = this.prestationService.getPrestaTypeListWithPrestaDetails();

    this.types = this.prestationService.getPrestaTypeList();
    // this.oldprestas = this.prestationService.getServicesList();
  }

  ngOnInit() {
    this.typeselected = '';
    this.showTypeSelect = true;    
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

  typeSelected(type: Type) {
    this.typeselected = type.title;
    this.showTypeSelect = true;
    this.filtre = {
      types: [[ '' , this.typeselected ]]
    };
    console.log( this.typeselected);
  }  

}