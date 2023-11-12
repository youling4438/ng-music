import {ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef,} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
	selector: 'app-size',
	templateUrl: './size.component.html',
	styleUrls: ['./size.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: forwardRef(() => SizeComponent),
		multi: true,
	}],
})
export class SizeComponent implements ControlValueAccessor {
	size: number = 16;

	constructor(private cdr: ChangeDetectorRef,) {
	}

	btnClickHandle(btnType: 'add' | 'min'): void {
		const diff = {
			'add': 1,
			'min': -1,
		};
		this.size += diff[btnType];
		this.onChange(this.size);
	}

	private onChange = (_value: number): void => {
	}
	private onTouched = (): void => {
	}

	registerOnChange(fn: (_value: number) => void): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: () => void): void {
		this.onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		console.log('setDisabledState', isDisabled);
	}

	writeValue(value: number): void {
		this.size = value;
		this.cdr.markForCheck();
	}
}
