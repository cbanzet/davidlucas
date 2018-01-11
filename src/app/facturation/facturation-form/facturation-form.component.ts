import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { FormControl } from '@angular/forms';

import { FacturationService } from './../shared/facturation.service';
import { ClientService } from './../../clients/shared/client.service';
import { MemberService } from './../../members/shared/member.service';
import { PrestationService } from './../../prestations/shared/prestation.service';

import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-facturation-form',
  templateUrl: './facturation-form.component.html',
  styleUrls: ['./facturation-form.component.css']
})
export class FacturationFormComponent implements OnInit {

  clientCtrl: FormControl = new FormControl();
  coiffeurCtrl: FormControl = new FormControl();
  prestationCtrl: FormControl = new FormControl();

  filteredClients: Observable<any[]>;  
  filteredCoiffeurs: Observable<any[]>;  
  filteredPrestations: Observable<any[]>;  

  clients: any;  
  coiffeurs: any; 
  prestations:any; 
  eventkey:any;
  event:any;
  
  moyenDePaiement:any;moypay:any;

  selectedClient:Observable<any[]>;
  selectedCoiffeur:Observable<any[]>;
  selectedPrestation:Observable<any[]>;
  promotion:Observable<any[]>;
  selectedEvent;

  selectedDate;
  selectedFirstnameCoiffeur;
  selectedPrice:number;
  selectedQty:number=1;

  totalHT: number=0;
  totalTAX: number=0;
  totalTTC: number=0;
  
  promo: number;promoEuros:number;

  billready:boolean=false;
  showSelectPrestation:boolean=true;

  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    private location: Location, 	
  	private facturationService: FacturationService,
  	private clientService: ClientService,
    private memberService: MemberService,
    private prestationService: PrestationService        
  ) { }





  filterClients(val: string) {
    return this.clients.map(response => response.filter(client => { 
        return client.firstname.toLowerCase().indexOf(val.toLowerCase()) === 0
      }));
  }
  displayClientFn(client) {
    if(client) { var fullname = `${client.firstname} ${client.lastname}`; }
    else var fullname = ''; return client ? fullname : client;
  }

  filterCoiffeurs(val: string) {
    return this.coiffeurs.map(response => response.filter(coiffeur => { 
        return coiffeur.firstname.toLowerCase().indexOf(val.toLowerCase()) === 0
      }));
  }
  displayCoiffeurFn(coiffeur) {
    if(coiffeur) { var fullname = `${coiffeur.firstname} ${coiffeur.lastname}`; }
    else var fullname = ''; return coiffeur ? fullname : coiffeur;
  }

  filterPrestations(val: string) {
    return this.prestations.map(response => response.filter(prestation => { 
        return prestation.title.toLowerCase().indexOf(val.toLowerCase()) === 0
      }));
  }
  displayPrestationFn(prestation) {
    if(prestation) { var fulltitle = `${prestation.title} ${prestation.details}`; }
    else var fulltitle = ''; return prestation ? fulltitle : prestation;
  }


  getTotalTAX() {
    this.totalTAX = Math.round((this.selectedPrice*this.selectedQty*0.2)*100)/100;    
  }
  getTotalHT() {
    this.totalHT = Math.round(this.selectedPrice*this.selectedQty*100)/100;
  }
  getTotalTTC() {
    this.totalTTC = this.totalTAX + this.totalHT;
  }
  sumTablePrice() {
    this.getTotalHT();
    this.getTotalTAX();
    this.getTotalTTC();
    this.billready=true;
  }


  ngOnInit() {
    // GET KEY FROM URL AND SAVE IT TO EVENTKEY
    // this.route.params.subscribe((params: Params) => {
    //     this.eventkey = params['eventid'];
    //     console.log(this.eventkey);
    // });

    // if(this.eventkey==0) { this.selectedEvent = null;
    // }
    // else { 
    //   this.selectedEvent = this.facturationService.getDataWithEventKey(this.eventkey) 
    //   // this.selectedEvent = this.eventService.getDateEventWithKey(this.eventkey) 
    // }

    this.clients = this.clientService.getClientsList();
    this.coiffeurs = this.memberService.getMembersList();    
    this.prestations = this.prestationService.getPrestationsList();


    this.filteredClients = this.clientCtrl.valueChanges
      .startWith(null)
      .switchMap(client => {
        if(client) {
          if(client.firstname) { 
            var key = client.$key;
            this.selectedClient = client;            
            return this.clients;
          }
          else return this.filterClients(client)
        } else {
          // do something better here :P
          return this.filterClients('something');
        }
      })

    this.filteredCoiffeurs = this.coiffeurCtrl.valueChanges
      .startWith(null)
      .switchMap(coiffeur => {
        if(coiffeur) {
          if(coiffeur.firstname) { 
            var key = coiffeur.$key;
            this.selectedFirstnameCoiffeur = coiffeur.firstname;
            this.selectedCoiffeur = coiffeur;            
            return this.coiffeurs;
          }
          else return this.filterCoiffeurs(coiffeur)
        } else {
          // do something better here :P
          return this.filterCoiffeurs('something');
        }
      })

    this.filteredPrestations = this.prestationCtrl.valueChanges
      .startWith(null)
      .switchMap(prestation => {
        if(prestation) {
          if(prestation.title) { 
            console.log('Prestation Page'); 
            var key = prestation.$key;
            this.selectedPrestation = prestation;
            // Récupération du prix en fonction du coiffeur 
            if(this.selectedFirstnameCoiffeur=='David') { this.selectedPrice=prestation.priceDavid;}
            else {this.selectedPrice=prestation.priceTeam;}
            // Calcul des Prix HT,TAX,TTC
            this.sumTablePrice();
            return this.prestations;
          }
          else return this.filterPrestations(prestation)
        } else {
          // do something better here :P
          return this.filterPrestations('something');
        }
      })
  }


  getBill() {

    var client = this.selectedClient;
    var coiffeur = this.selectedCoiffeur;
    var prestation = this.selectedPrestation;
    var moyenDePaiement = this.moyenDePaiement?this.moyenDePaiement:"";

    this.facturationService.createNewFacture(
      this.selectedDate,
      client,coiffeur,prestation,
      moyenDePaiement,
      this.totalHT,this.totalTAX,this.totalTTC);        
  }

  changeQty(n) {
    this.selectedQty = this.selectedQty + n;
    this.sumTablePrice();
  }

  applyPromo(n) {
    this.promo=n;
    this.promoEuros = Math.round((this.totalHT*n)*100)/100;
    this.totalTAX = (Math.round((((this.selectedPrice*this.selectedQty)-this.promoEuros)*0.2)*100)/100);
    this.totalHT = Math.round((this.selectedPrice*this.selectedQty*100)-this.promoEuros)/100;
    this.totalTTC = this.totalTAX + this.totalHT;        
  }

  applyMoyPaiement(n) {
    this.moypay = n;
    console.log(this.moypay)
  }

  reset() {
    this.selectedDate = null;
    this.selectedClient = null;
    this.selectedCoiffeur = null;
    this.selectedPrestation = null;
  }

  goBack(): void {
    this.location.back();
  }  


}