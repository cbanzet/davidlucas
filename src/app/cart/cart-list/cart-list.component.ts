import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { CartService } from './../shared/cart.service';
// import { MemberService } from './../../members/shared/member.service';

@Component({
  selector: 'app-cart-list',
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.css']
})
export class CartListComponent implements OnInit {

  carts: Observable<any[]>;
  removed = true ;

  constructor(
		private router: Router,
    private location: Location,
    // private memberService: MemberService,
    private cartService: CartService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
  	this.carts = this.cartService.getCartList();
  }

  deleteCart(cart, prestas) {
    this.cartService.deleteCart(cart, prestas);
  }

  openDialog(cart): void {
    const dialogRef = this.dialog.open( CartListRemoveComponent, {
      width: '300px',
      data: { cartkey: cart.$key }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

  redirection(cart) {
    if ( cart.statut === 'paid' ) {
      // console.log(cart)
       this.router.navigate(['/facturationcart/'+cart.$key]) ;
    } else if ( cart.statut === 'filled') {
      this.router.navigate(['/cart/'+cart.$key]) ;
    } else if ( cart.statut === 'waiting') {
      this.cartService.doCart(cart , 'ongoing');
    } else if ( cart.statut === 'billing') {
      this.router.navigate(['/facturationcart/'+cart.$key]) ;
    } else {
      this.cartService.doCart(cart , 'filled');
      this.router.navigate(['/cart/'+cart.$key]) ;
    }
  }

}


@Component({
  selector: 'app-cart-list-remove',
  templateUrl: 'cart-list-remove.html',
})
export class CartListRemoveComponent {
  cart: Observable<any[]>;
  cartkey: any;
  constructor(
    private cartService: CartService,
    public dialogRef: MatDialogRef<CartListRemoveComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
      this.cartkey = data.cartkey;
      this.cart = this.cartService.getCartWithKey(this.cartkey);
      console.log(this.cart);
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  deleteCart(cart , prestas) {
    this.cartService.deleteCart(cart, prestas);
    this.dialogRef.close();
  }

}
