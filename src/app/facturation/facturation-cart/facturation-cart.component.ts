import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

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

  moypay         :any;
  promotion      :Observable<any[]>;
  newref         :any;

  selectedPrice  :number;
  selectedQty    :number=1;
  
  newtotalTAX    : number=0;
  newtotalTTC    : number=0;
  newtotalHT     : number=0;

  billready      :boolean=false;
  promo          : number;promoEuros:number;  

  freeamount     :number;
  freepromo      :number;

  constructor(
    private route: ActivatedRoute,
    private router: Router, 
  	private clientService: ClientService,
    private cartService: CartService,
    private location: Location, 	
  	private facturationService: FacturationService,
    public dialog: MatDialog         
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
    const today = Date.now();
    this.newref = this.facturationService.getNewBillRef(today);
    console.log(this.newref);

    this.cart = this.route.paramMap
      .switchMap((params: ParamMap) =>
        this.cartService.getCartWithProductWithKey(params.get('cartid')));  	
  }

  getBill(cart,newref) {
    var facref = newref.toString();
    var facref = facref.split('-')[3]=='NaN' ? facref.replace('NaN', '00') : facref;
    var moyenDePaiement = this.moypay?this.moypay:"";

    // console.log(facref);

    this.facturationService.createBillFromCart(
         cart,moyenDePaiement,this.promo,
         this.newtotalTTC,this.newtotalHT,this.newtotalTAX,
         facref);        
  }

  openDialog(cart): void {

    const oldpx = parseFloat(cart.totalTTC);

    const dialogRef = this.dialog.open( BillFreeTotalComponent, {
      width: '300px',
      data: { freeamount: this.freeamount }
    });

    dialogRef.afterClosed().subscribe(result => {

      this.newtotalTTC = Math.round((result)*100)/100;
      this.newtotalHT  = Math.round((this.newtotalTTC/1.2)*100)/100;
      this.newtotalTAX = Math.round((this.newtotalTTC-this.newtotalHT)*100)/100;    

      this.promoEuros = oldpx - this.newtotalTTC;
      this.freepromo = Math.round(((this.promoEuros*100)/oldpx)*100)/100;

      this.promo = this.freepromo/100;
      this.freeamount = result;

      console.log(this.promo);      

    });
  }


  print_page() {
     window.print();
  }


  goBack(): void {
    this.location.back();
  } 

}






@Component({
  selector: 'bill-free-total',
  templateUrl: 'bill-free-total.html',
  styles: [
    'button { margin: 0 10px 20px 0 }'
  ]  
})
export class BillFreeTotalComponent {
  
  constructor(
    public dialogRef: MatDialogRef<BillFreeTotalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) 
  {
     console.log(data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}


