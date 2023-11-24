import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {MessageItemData} from "../types";

@Component({
	selector: 'app-message-item',
	templateUrl: './message-item.component.html',
	styleUrls: ['./message-item.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})

export class MessageItemComponent {
	@Input() message: MessageItemData;
	@Input() index: number;

	get className(): string {
		return 'app-message clearfix ' + this.message.options.type;
	}
}
