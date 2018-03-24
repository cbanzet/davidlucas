import { Pipe, PipeTransform } from '@angular/core';
import { Product } from './../../products/shared/product';
@Pipe({
  name: 'filterproduct'
})


export class FilterProduct implements PipeTransform {
	transform(items: any[], filtre: Product): any[] {
		if (!items || !filtre) 
		{
			return items;
		}
		return items.filter(item => item.brand.indexOf(filtre.brand) !== -1);
	}
}