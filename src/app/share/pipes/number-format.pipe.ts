import {Pipe, PipeTransform} from '@angular/core';
import {round} from 'lodash';

enum Exponent {
	'万' = 10000,
	'亿' = 100000000
}

@Pipe({
	name: 'numberFormat'
})
export class NumberFormatPipe implements PipeTransform {
	transform(value: number, precision: number = 1): string {
		if (value < Exponent['万']) {
			return `${value}`;
		} else if (value < Exponent['亿']) {
			return round(value / Exponent['万'], precision) + '万';
		} else {
			return round(value / Exponent['亿'], precision) + '亿';
		}
	}
}
