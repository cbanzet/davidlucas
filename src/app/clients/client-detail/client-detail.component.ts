import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { FormsModule } from "@angular/forms";

import { ClientService } from './../shared/client.service';

@Component({
  selector: 'client-detail',
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.css']
})
export class ClientDetailComponent implements OnInit {

  client: Observable<any>;

  firstnameField = "firstname";
  lastnameField = "lastname";
  emailField = "email";
  phoneField = "phone";
  streetField = "street";
  zipField = "zip";
  cityField = "city";
  birthdateField = "birthdate";
  fichetechniqueField = "fichetechnique";


  // @Input() client: Client;

  constructor(
  	private clientService: ClientService,
  	private route: ActivatedRoute,
    private router: Router,
  	private location: Location) 
  {}

  ngOnInit() {
    this.client = this.route.paramMap
      .switchMap((params: ParamMap) =>
        this.clientService.getClientWithKey(params.get('id')));
  }

  updateField(key,field,value) {
    this.clientService.updateClient(key,field,value);
  }

  goBack(): void {
  	this.location.back();
	}

}