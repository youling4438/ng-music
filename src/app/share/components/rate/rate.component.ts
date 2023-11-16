import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
	ViewEncapsulation
} from '@angular/core';
import {RateItemTypeClass} from "./type";

@Component({
	selector: 'app-rate',
	templateUrl: './rate.component.html',
	styleUrls: ['./rate.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class RateComponent implements OnInit {
	@Input() count: number = 5;
	@Output() rateChange = new EventEmitter<number>();
	public iconArray: number[] = [];
	private hoverValue: number;
	private actualValue: number;
	private hasHalf: boolean;
	iconClassNameList: string[] = [];

	constructor() {
	}

	ngOnInit() {
		this.iconArray = Array(this.count).fill(0).map((value, index) => index);
		this.iconClassNameList = Array(this.count).fill('app-rate-item');
	}

	clickItem(isHalf: boolean, index: number): void {
		this.hoverValue = index + 1;
		this.hasHalf = isHalf;
		const newValue = isHalf ? index + 0.5 : index + 1;
		if (newValue !== this.actualValue) {
			this.actualValue = newValue;
			this.updateIconStyle();
			this.rateChange.emit(this.actualValue);
		}
	}

	hoverItem(isHalf: boolean, index: number): void {
		if (this.hoverValue === index + 1 && isHalf === this.hasHalf) {
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
			return className;
		});
	}
}
