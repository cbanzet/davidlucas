import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { FormControl } from '@angular/forms';

import { ProductsService } from './../shared/products.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {

	addprdct:boolean=true;
	addprdcts:boolean=false;

  brands = [
  	"David Lucas",
  	"Deuxs1",
    "Kerastase",
    "Leonor Greyl",
    "Shu Uemura"
  ]

  constructor(private router: Router,
              private location: Location,
  						private productsService: ProductsService) { }

  ngOnInit() {
  }

  onSubmit(pdctForm: NgForm) {
  	this.productsService.createProduct(pdctForm);
  } 

  onSubmits(pdctsForm: NgForm) {
  	this.productsService.createProducts(pdctsForm);
  } 

  goBack(): void {
    this.location.back();
  }

}
