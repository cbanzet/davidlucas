import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute, Params, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { ForfaitService } from './../../forfaits/shared/forfait.service';
import { PrestationService } from './../../prestations/shared/prestation.service';
import { CartService  } from './../../cart/shared/cart.service';
import { NgForm } from '@angular/forms';
import { Cart } from './../../cart/shared/cart';

@Component({
  selector: 'app-cart-detail',
  templateUrl: './cart-detail.component.html',
  styleUrls: ['./cart-detail.component.css']
})
export class CartDetailComponent implements OnInit {

  cart: Observable<any>;

	prestations: any;
  forfaits: any;
  data: Array<Cart> = [];
  tab = ['un', 'deux'];
  prestationKeyAdded;

  totalHT:number=0;
  totalTAX:number=0;
  totalTTC:number=0;

	showAddPrestaSection:boolean=false;
	showAddPrestaSectionButton:boolean=true;
	showRemovePrestaSectionButton:boolean=false;

  showAddForfaitSection:boolean=false;
  showAddForfaitSectionButton:boolean=true;
  showRemoveForfaitSectionButton:boolean=false;

  constructor(
    private prestationService: PrestationService,
    private forfaitService: ForfaitService ,
    private cartService: CartService,
  	private route: ActivatedRoute,
    private router: Router,    
  ) 
  {
  	this.prestations = this.prestationService.getPrestationsList();
    this.forfaits = this.forfaitService.getForfaitsList();
  }

  ngOnInit() {
    this.cart = this.route.paramMap
      .switchMap((params: ParamMap) =>
        this.cartService.getCartWithKey(params.get('id')));  	
  }

  goToBill(cart) {
    this.router.navigate(['/facturationcart/'+cart.$key])  	
  }

}
