import {Pipe, PipeTransform} from '@angular/core';
import {round} from 'lodash';

type unitTypes = '万' | '亿';

enum Exponent {
	'万' = 10000,
	'亿' = 100000000
}

interface NumberFormatConfig {
	unit?: unitTypes,
	precision?: number,
}

const defaultConfig: NumberFormatConfig = {
	unit: '万',
	precision: 1,
}

@Pipe({
	name: 'numberFormat'
})
export class NumberFormatPipe implements PipeTransform {

	transform(value: number, config?: NumberFormatConfig): number {
		const unit = config?.unit || defaultConfig.unit ;
		const precision: number = config?.precision || defaultConfig.precision;
		return round(value / Exponent[unit], precision);
	}

}
