import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	forwardRef,
	HostBinding, HostListener,
	ViewEncapsulation
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
	selector: 'label[app-checkbox]',
	templateUrl: './checkbox.component.html',
	styleUrls: ['./checkbox.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => CheckboxComponent),
			multi: true,
		}
	],
	host: {
		'[class.app-checkbox-wrap]' : 'true',
	}
})
export class CheckboxComponent implements ControlValueAccessor {
	@HostBinding('class.checked') checked: boolean = false;
	@HostBinding('class.disabled') disabled: boolean = false;

	constructor(private cdr: ChangeDetectorRef) {
	}

	@HostListener('click', ['$event'])
	hostClick(event: MouseEvent): void {
		event.preventDefault();
		if (!this.disabled) {
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
