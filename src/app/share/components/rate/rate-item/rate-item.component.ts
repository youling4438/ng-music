import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TemplateRef} from '@angular/core';
import {RateItemTypeClass} from "../type";

@Component({
	selector: 'app-rate-item',
	templateUrl: './rate-item.component.html',
	styleUrls: ['./rate-item.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RateItemComponent {
	@Input() itemClassName: string = RateItemTypeClass.Normal;
	@Input() rateTemplate: TemplateRef<void>;
	@Output() iconClickHandle = new EventEmitter<boolean>();
	@Output() iconHoverHandle = new EventEmitter<boolean>();

	iconClick(isHalf: boolean): void {
		this.iconClickHandle.emit(isHalf);
	}

	iconHover(isHalf: boolean): void {
		this.iconHoverHandle.emit(isHalf);
	}
}
