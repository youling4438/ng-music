import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {MessageItemData, MessageOptions} from "./types";

@Component({
	selector: 'app-message',
	templateUrl: './message.component.html',
	styleUrls: ['./message.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageComponent {
	messageList: MessageItemData[] = [];
	readonly defaultConfig: MessageOptions = {
		type: 'info',
		duration: 3000,
		showClose: true,
	};

	constructor(
		private cdr: ChangeDetectorRef,
	) {
	}

	createMessage(message: MessageItemData) {
		message.options = {...this.defaultConfig, ...message.options};
		this.messageList.push(message);
		this.cdr.markForCheck();
	}

}
