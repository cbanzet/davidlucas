import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { ClientService } from './../shared/client.service';

@Component({
  selector: 'app-client-search',
  templateUrl: './client-search.component.html',
  styleUrls: ['./client-search.component.css']
})
export class ClientSearchComponent implements OnInit {

  clientCtrl: FormControl = new FormControl();
  filteredClients: Observable<any[]>;  
  clients: any;


  constructor(
    private router: Router,    
  	private location: Location,
  	private clientService: ClientService,) 
	  { }


  filterClients(val: string) {
    return this.clients
      .map(response => response.filter(client => { 
        return client.firstname.toLowerCase().indexOf(val.toLowerCase()) === 0
      }));
  }

  displayFn(client) {
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
            this.router.navigate(['/client/'+key]);
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





  goBack(): void {
    this.location.back();
  }

}
