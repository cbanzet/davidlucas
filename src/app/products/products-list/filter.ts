import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../shared/product';
@Pipe({
  name: 'filter'
})


export class FilterPipe implements PipeTransform {
  transform(items: any[], filtre: Product): any[] {
    if (!items || !filtre) {
      return items;
  }
  return items.filter(item => item.types[0][1].indexOf(filtre.types[0][1]) !== -1);
}

}
