import {ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
	selector: 'app-rate',
	templateUrl: './rate.component.html',
	styleUrls: ['./rate.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class RateComponent implements OnInit{
	@Input() count:number = 5;
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
		console.log('isHalf: ', isHalf);
		console.log('index: ', index);
	}
	hoverItem(isHalf: boolean, index: number): void {
		this.hoverValue = index + 1;
		this.hasHalf = isHalf;
		this.updateIconStyle();
	}

	private updateIconStyle = () => {
		this.iconClassNameList = this.iconClassNameList.map((className: string, index: number) => {
			let newClass: string;
			if(index + 1 < this.hoverValue || (index + 1 === this.hoverValue && !this.hasHalf)) {
				newClass = 'app-rate-item-full';
			} else if(index + 1 === this.hoverValue && this.hasHalf) {
				newClass = 'app-rate-item-half';
			} else {
				newClass = '';
			}
			className = `app-rate-item ${newClass}`;
			return className;
		});
	}
}
