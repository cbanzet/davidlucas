import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { FormControl } from '@angular/forms';

import { ClientService } from './../shared/client.service';

@Component({
  selector: 'app-clients-list',
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.css']
})
export class ClientsListComponent implements OnInit {

  clientlist: Observable<any[]>;
  clients: Observable<any[]>;
  filteredClients: Observable<any[]>;
  clientCtrl: FormControl = new FormControl();

  matCardClientsList: boolean=true;

  constructor(
    private router: Router,
    private clientService: ClientService) 
  {
  }


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

  deleteClient(client) {    
    this.clientService.deleteClient(client);
  }

}