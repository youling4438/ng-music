import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter} from '@angular/core';
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
		pauseOnHover: true,
	};
	destroyComponent = new EventEmitter<void>();

	constructor(
		private cdr: ChangeDetectorRef,
	) {
	}

	createMessage(message: MessageItemData): MessageItemData {
		message.options = {...this.defaultConfig, ...message.options};
		this.messageList.push(message);
		this.cdr.markForCheck();
		return message;
	}

	removeMessage(id: string): void {
		const targetIndex: number = this.messageList.findIndex(message => message.messageId === id);
		if (targetIndex > -1) {
			this.messageList[targetIndex].onClose.next();
			this.messageList[targetIndex].onClose.complete();
			this.messageList.splice(targetIndex, 1);
			this.cdr.markForCheck();
		}
		if (this.messageList.length === 0) {
			this.destroyComponent.emit();
		}
	}
}
