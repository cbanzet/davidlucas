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

  moypay:any;
  promotion:Observable<any[]>;

  selectedPrice:number;
  selectedQty:number=1;
  
  newtotalTAX: number=0;
  newtotalTTC: number=0;
  newtotalHT: number=0;

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
    this.moypay      = n;
    this.billready   = true;
    console.log(this.moypay)
  }

  applyPromo(n,ttc) {
    this.promo       = n;
    this.promoEuros  = Math.round((ttc*n)*100)/100;
 
    this.newtotalTTC = Math.round((ttc-this.promoEuros)*100)/100;
    this.newtotalHT  = Math.round((this.newtotalTTC/1.2)*100)/100;
    this.newtotalTAX = Math.round((this.newtotalTTC-this.newtotalHT)*100)/100;    
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
    this.facturationService.createBillFromCart(
                                cart,
                                moyenDePaiement,
                                this.promo,
                                this.newtotalTTC,
                                this.newtotalHT,
                                this.newtotalTAX
                            );        
  }


  goBack(): void {
    this.location.back();
  } 

}
