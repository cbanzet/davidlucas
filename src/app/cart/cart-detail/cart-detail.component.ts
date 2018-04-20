import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute, Params, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { ForfaitService } from './../../forfaits/shared/forfait.service';
import { PrestationService } from './../../prestations/shared/prestation.service';
import { CartService  } from './../../cart/shared/cart.service';
import { ProductsService } from './../../products/shared/products.service';
import { MemberService } from './../../members/shared/member.service';

import { Type } from './../../prestations/shared/type';


import { NgForm } from '@angular/forms';
import { Cart } from './../../cart/shared/cart';

@Component({
  selector: 'app-cart-detail',
  templateUrl: './cart-detail.component.html',
  styleUrls: ['./cart-detail.component.css']
})
export class CartDetailComponent implements OnInit {

  cart: Observable<any>;

  Brands = [
    {
      id: 1,
      title: 'Kérastase'
    },
    {
      id: 2,
      title: 'SHU UEMURA'
    },
    {
      id: 3,
      title: 'LEONOR GREYL'
    },
    {
      id: 4,
      title: 'DEUXS'
    }
  ];

  forfaitTypes: Observable<any[]>;
  members: Observable<any[]>;
  types: Observable<any[]>;
  typeselected: string;
  typeselectedProduct: string;
  typeselectedforfait: string;
  filtre: Object;
  filtreproduct: Object;
  filtreForfait: Object;

	prestations: any;
  products: any;
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

  showAddProductSection:boolean=false;
  showAddProductSectionButton:boolean=true;
  showRemoveProductSectionButton:boolean=false;

  constructor(   
    private prestationService: PrestationService,
    private forfaitService: ForfaitService ,
    private productsService: ProductsService,
    private memberService: MemberService,
    private cartService: CartService,
  	private route: ActivatedRoute,
    private router: Router,    
  ) 
  {
  	this.prestations = this.prestationService.getPrestationsList();
    this.forfaits = this.forfaitService.getForfaitsList();
    this.products = this.productsService.getProductsList();

    this.forfaitTypes = this.forfaitService.getForfaitTypeList();
    this.types = this.prestationService.getPrestaTypeList(); 
    this.members = this.memberService.getMembersList();    
  }

  ngOnInit() {
    this.cart = this.route.paramMap
      .switchMap((params: ParamMap) =>
        this.cartService.getCartWithProductWithKey(params.get('id')));  	
  }


  typeSelected(type: Type) {
    this.typeselected = type.title;
    this.filtre = {
      types: [[ '' , this.typeselected ]]
    };
    console.log( this.typeselected);
  }

  typeSelectedProduct(type: Type) {
    this.typeselectedProduct = type.title;
    this.filtreproduct = {
      brand: this.typeselectedProduct
    };
    console.log( this.typeselectedProduct);
  }

  typeSelectedForfait(type: Type) {
    this.typeselectedforfait = type.title;
    this.filtreForfait = {
        type: this.typeselectedforfait
    };
    console.log( this.typeselectedforfait);
  }


  goToBill(cart) {
    this.cartService.doCart(cart,'billing');
    this.router.navigate(['/facturationcart/'+cart.$key])  	
  }

  insertInOldCart(element, cart, data) {
    this.cartService.updateInCart(cart, data, element);
  }

  addProductToCart(product,cart) {
    this.cartService.addProductToCart(product,cart);
  }

  deletePresta(presta, cart) {
     this.cartService.removePrestaFromCart(presta, cart);
  }

  deleteProduct(product, cart) {
     this.cartService.removeProductFromCart(product, cart);
  }
  changeCoiffeur(element,member,cart,type) {
    this.cartService.changeCoiffeurIncart(element,member,cart,type);
  }
  deleteCart(cart) {
    // this.cartService.deleteCartFromCartDetail(cart);
  }

}
