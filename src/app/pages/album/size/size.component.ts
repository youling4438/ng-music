import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
	selector: 'app-size',
	templateUrl: './size.component.html',
	styleUrls: ['./size.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SizeComponent {
	@Input() size: number = 16;
	@Output() sizeChange = new EventEmitter<number>();
	btnClickHandle(btnType: 'add' | 'min') :void {
		const diff = {
			'add': 1,
			'min': -1,
		};
		this.sizeChange.emit(this.size + diff[btnType]);
	}
}
