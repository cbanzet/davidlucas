import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { CartService } from './../shared/cart.service';
// import { MemberService } from './../../members/shared/member.service';

@Component({
  selector: 'app-cart-list',
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.css']
})
export class CartListComponent implements OnInit {

	carts: Observable<any[]>;

  constructor(
		private router: Router,
    private location: Location,
    // private memberService: MemberService,
    private cartService: CartService
  ) { }

  ngOnInit() {
  	this.carts = this.cartService.getCartList();  	  	  	
  }

  deleteCart(cart) {
    this.cartService.deleteCart(cart);
  }

}
