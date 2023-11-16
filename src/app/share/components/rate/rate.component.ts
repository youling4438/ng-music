import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	forwardRef,
	Input,
	OnInit,
	ViewEncapsulation
} from '@angular/core';
import {RateItemTypeClass} from "./type";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";


@Component({
	selector: 'app-rate',
	templateUrl: './rate.component.html',
	styleUrls: ['./rate.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => RateComponent),
			multi: true,
		}
	],
})
export class RateComponent implements OnInit, ControlValueAccessor {
	@Input() count: number = 5;
	public iconArray: number[] = [];
	private hoverValue: number;
	private actualValue: number;
	private hasHalf: boolean;
	iconClassNameList: string[] = [];
	private readonly: boolean;

	constructor(private cdr: ChangeDetectorRef,) {
	}

	ngOnInit() {
		this.iconArray = Array(this.count).fill(0).map((value, index) => index);
		this.iconClassNameList = Array(this.count).fill('app-rate-item');
	}

	clickItem(isHalf: boolean, index: number): void {
		if (this.readonly) {
			return;
		}
		this.hoverValue = index + 1;
		this.hasHalf = isHalf;
		const newValue = isHalf ? index + 0.5 : index + 1;
		if (newValue !== this.actualValue) {
			this.actualValue = newValue;
			this.onChange(this.actualValue);
			this.updateIconStyle();
		}
	}

	hoverItem(isHalf: boolean, index: number): void {
		if (this.readonly || (this.hoverValue === index + 1 && isHalf === this.hasHalf)) {
			return;
		}
		this.hoverValue = index + 1;
		this.hasHalf = isHalf;
		this.updateIconStyle();
	}

	leaveItem(): void {
		this.hasHalf = !Number.isInteger(this.actualValue);
		this.hoverValue = Math.ceil(this.actualValue);
		this.updateIconStyle();
	}

	private updateIconStyle = () => {
		this.iconClassNameList = this.iconClassNameList.map((className: string, index: number) => {
			let newClass: string;
			if (index + 1 < this.hoverValue || (index + 1 === this.hoverValue && !this.hasHalf)) {
				newClass = RateItemTypeClass.Full;
			} else if (index + 1 === this.hoverValue && this.hasHalf) {
				newClass = RateItemTypeClass.Half;
			} else {
				newClass = '';
			}
			className = `${RateItemTypeClass.Normal} ${newClass}`;
			if(this.readonly){
				className += ` ${RateItemTypeClass.Readonly}`;
			}
			return className;
		});
	}

	private onChange: (value: number) => void = () => {
	};
	private onTouched: () => void = () => {
	};

	registerOnChange(fn: (value: number) => void): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: () => void): void {
		this.onTouched = fn;
	}

	setDisabledState(disabled: boolean): void {
		this.readonly = disabled;
	}

	writeValue(rate: number): void {
		if (rate && rate !== this.actualValue) {
			this.actualValue = rate;
			this.leaveItem();
			this.cdr.markForCheck();
		}
	}
}
