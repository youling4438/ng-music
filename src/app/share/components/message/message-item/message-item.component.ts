import {ChangeDetectionStrategy, Component, Input,} from '@angular/core';
import {MessageItemData} from "../types";
import {MessageComponent} from "../message.component";

@Component({
	selector: 'app-message-item',
	templateUrl: './message-item.component.html',
	styleUrls: ['./message-item.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})

export class MessageItemComponent {
	@Input() message: MessageItemData;
	@Input() index: number;

	constructor(private parent: MessageComponent) {
	}

	get className(): string {
		return 'app-message clearfix ' + this.message.options.type;
	}

	close(): void {
		this.parent.removeMessage(this.message.messageId);
	}
}
