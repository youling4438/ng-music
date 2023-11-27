import {TemplateRef} from "@angular/core";
import {Subject} from "rxjs";

export type MessageType = 'success' | 'warning' | 'info' | 'error';

export interface MessageOptions {
	type?: MessageType;
	showClose?: boolean;
	duration?: number;
	pauseOnHover?: boolean;
}

export interface MessageItemData {
	messageId: string;
	content: string | TemplateRef<void>;
	onClose: Subject<void>;
	options?: MessageOptions;
}
