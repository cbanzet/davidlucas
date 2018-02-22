import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { FormControl } from '@angular/forms';

import { FacturationService } from './../shared/facturation.service';
import { ClientService } from './../../clients/shared/client.service';
// import { MemberService } from './../../members/shared/member.service';
// import { PrestationService } from './../../prestations/shared/prestation.service';
import { CartService  } from './../../cart/shared/cart.service';

import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-facturation-cart',
  templateUrl: './facturation-cart.component.html',
  styleUrls: ['./facturation-cart.component.css']
})
export class FacturationCartComponent implements OnInit {

  getEvent;
  cart;
  cartkey;
  priceEvent: Observable<any>;

  moypay:any;
  promotion:Observable<any[]>;

  selectedPrice:number;
  selectedQty:number=1;
  totalHT: number=0;
  totalTAX: number=0;
  totalTTC: number=0;

  billready:boolean=false;
  promo: number;promoEuros:number;  

  constructor(
    private route: ActivatedRoute,
    private router: Router, 
  	private clientService: ClientService,
    private cartService: CartService,
    private location: Location, 	
  	private facturationService: FacturationService     
  ) { }


  applyMoyPaiement(n) {
    this.moypay = n;
    this.billready=true;
    console.log(this.moypay)
  }

  applyPromo(n) {
    this.promo=n;
    this.promoEuros = Math.round((this.totalHT*n)*100)/100;
    this.totalTAX = (Math.round((((this.selectedPrice*this.selectedQty)-this.promoEuros)*0.2)*100)/100);
    this.totalHT = Math.round((this.selectedPrice*this.selectedQty*100)-this.promoEuros)/100;
    this.totalTTC = this.totalTAX + this.totalHT;        
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
        // this.cartkey = params['cartid'];
    // });

    this.cart = this.route.paramMap
      .switchMap((params: ParamMap) =>
        this.cartService.getCartWithKey(params.get('cartid')));  	
  }


  getBill(cart) {
    var moyenDePaiement = this.moypay?this.moypay:"";
    this.facturationService.createBillFromCart(cart,moyenDePaiement,this.promo);        
  }


  goBack(): void {
    this.location.back();
  } 

}
