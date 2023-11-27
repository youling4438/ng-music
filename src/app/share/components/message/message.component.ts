import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, PLATFORM_ID} from '@angular/core';
import {MessageItemData, MessageOptions} from "./types";
import {isPlatformBrowser} from "@angular/common";

@Component({
	selector: 'app-message',
	templateUrl: './message.component.html',
	styleUrls: ['./message.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageComponent {
	isBrowser: boolean;
	messageList: MessageItemData[] = [];
	readonly defaultConfig: MessageOptions = {
		type: 'info',
		duration: 3000,
		showClose: true,
		pauseOnHover: false,
		maxStack: 5,
	};
	destroyComponent = new EventEmitter<void>();

	constructor(
		private cdr: ChangeDetectorRef,
		@Inject(PLATFORM_ID) private platformId: object,
	) {
		this.isBrowser = isPlatformBrowser(this.platformId);
	}

	createMessage(message: MessageItemData): MessageItemData {
		if (this.isBrowser) {
			message.options = {...this.defaultConfig, ...message.options};
			if (message.options.maxStack > 0 && this.messageList.length >= message.options.maxStack) {
				this.removeMessage(this.messageList[0].messageId);
			}
			this.messageList.push(message);
			this.cdr.markForCheck();
		}
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
