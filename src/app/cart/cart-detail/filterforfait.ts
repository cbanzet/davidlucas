import { Pipe, PipeTransform } from '@angular/core';
import { Forfait } from './../../forfaits/shared/forfait';
@Pipe({
  name: 'filterforfait'
})


export class FilterForfaitPipe implements PipeTransform {
 transform(items: any[], filtre: Forfait): any[] 
 {
    if (!items || !filtre) {
      return items;
  	}
  	return items.filter(item => item.type.indexOf(filtre.type) !== -1);
	}
}