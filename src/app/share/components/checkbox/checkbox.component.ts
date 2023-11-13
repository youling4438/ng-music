import {ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
	selector: 'app-checkbox',
	templateUrl: './checkbox.component.html',
	styleUrls: ['./checkbox.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => CheckboxComponent),
			multi: true,
		}
	],
})
export class CheckboxComponent implements ControlValueAccessor {
	checked: boolean = false;
	disabled: boolean = false;

	constructor(private cdr: ChangeDetectorRef) {
	}

	checkBoxToggle(event: MouseEvent): void {
		event.preventDefault();
		if(!this.disabled){
			this.checked = !this.checked;
			this.onChange(this.checked);
		}
	}

	private onChange = (value: boolean) => {
	};
	private onTouched = () => {
	};

	registerOnChange(fn: (value: boolean) => void): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: () => void): void {
		this.onTouched = fn;
	}

	setDisabledState(disabled: boolean): void {
		this.disabled = disabled;
	}

	writeValue(value: boolean): void {
		console.log('writeValue', value);
		this.checked = value;
		this.cdr.markForCheck();
	}

}
