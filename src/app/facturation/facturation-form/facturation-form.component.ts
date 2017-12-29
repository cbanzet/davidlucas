import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { FormControl } from '@angular/forms';

import { FacturationService } from './../shared/facturation.service';
import { ClientService } from './../../clients/shared/client.service';

import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-facturation-form',
  templateUrl: './facturation-form.component.html',
  styleUrls: ['./facturation-form.component.css']
})
export class FacturationFormComponent implements OnInit {

  clientCtrl: FormControl = new FormControl();
  filteredClients: Observable<any[]>;  
  // clients: any;
  clients: Observable<any[]>;  
  selectedClient:Observable<any[]>;
  selectedDate;

  constructor(
    private router: Router,  	
  	private facturationService: FacturationService,
  	private clientService: ClientService
  ) { }

  filterClients(val: string) {
    return this.clients
      .map(response => response.filter(client => { 
        return client.firstname.toLowerCase().indexOf(val.toLowerCase()) === 0
      }));
  }

  displayClientFn(client) {
    if(client) {
      var fullname = `${client.firstname} ${client.lastname}`;      
    }
    else var fullname = '';
    return client ? fullname : client;
  }


  ngOnInit() {
    this.clients = this.clientService.getClientsList();

    this.filteredClients = this.clientCtrl.valueChanges
      .startWith(null)
      .switchMap(client => {
        if(client) {
          if(client.firstname) { 
            console.log('Goto Client Page'); 
            var key = client.$key;
            this.selectedClient = client;            
            // this.router.navigate(['/client/'+key]);
            return this.clients;
          }
          else return this.filterClients(client)
        } else {
          // do something better here :P
          console.log('Do not get this case');
          return this.filterClients('something');
        }
      })   	
  }

  onSubmit(newFactureForm: NgForm) {
    this.facturationService.createFacture(newFactureForm);    
  } 


}