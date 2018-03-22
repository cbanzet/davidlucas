import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { FormsModule } from '@angular/forms';

import { ProductsService } from './../shared/products.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

	product: Observable<any>;

  titleField =      "title";
  brandField =      "brand";
  codeField =       "codeEAN";
  priceField = 			"px";
  contField =				"cont";
  refField =  			"reference";

  constructor(
  	private productService: ProductsService,
  	private route: ActivatedRoute,
  	private router: Router,
  	private location: Location
  	) { }

  ngOnInit() {
  	this.product = this.route.paramMap
  		.switchMap((params: ParamMap)=>
  			this.productService.getProductWithKey(params.get('id')));  	
  }

	updateField(product,field,value) {
		this.productService.updateProduct(product,field,value);
	}

  goBack(): void {
  	this.location.back();
	}
}
