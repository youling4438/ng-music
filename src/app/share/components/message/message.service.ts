import {
	ApplicationRef,
	ComponentFactoryResolver,
	ComponentRef,
	Inject,
	Injectable,
	Injector, PLATFORM_ID,
	Renderer2,
	RendererFactory2, TemplateRef
} from '@angular/core';
import {MessageModule} from "./message.module";
import {MessageComponent} from "./message.component";
import {DOCUMENT, isPlatformBrowser} from "@angular/common";
import {uniqueId} from "lodash";
import {Subject} from "rxjs";
import {MessageItemData, MessageOptions} from "./types";

@Injectable({
	providedIn: MessageModule,
})
export class MessageService {
	private message: MessageComponent;
	private rd2: Renderer2;
	private componentRef: ComponentRef<MessageComponent>;

	constructor(
		@Inject(DOCUMENT) private doc: Document,
		@Inject(PLATFORM_ID) private platformId: object,
		private rd2Factory: RendererFactory2,
		private cfr: ComponentFactoryResolver,
		private injector: Injector,
		private appRef: ApplicationRef,
	) {
		this.rd2 = this.rd2Factory.createRenderer(null, null);
	}


	info(content: string | TemplateRef<void>, options?: MessageOptions): MessageItemData {
		return this.create(content, {
			...options,
			type: 'info',
		});
	}

	success(content: string | TemplateRef<void>, options?: MessageOptions): MessageItemData {
		return this.create(content, {
			...options,
			type: 'success',
		});
	}

	warning(content: string | TemplateRef<void>, options?: MessageOptions): MessageItemData {
		return this.create(content, {
			...options,
			type: 'warning',
		});
	}

	error(content: string | TemplateRef<void>, options?: MessageOptions): MessageItemData {
		return this.create(content, {
			...options,
			type: 'error',
		});
	}

	private create(content: string | TemplateRef<void>, options?: MessageOptions): MessageItemData {
		if (!this.message) {
			this.message = this.getMessage();
		}
		const messageConfig: MessageItemData = {
			messageId: uniqueId('message_'),
			content,
			onClose: new Subject<void>(),
			options,
		};
		if (isPlatformBrowser(this.platformId)) {
			this.message.createMessage(messageConfig);
		}
		return messageConfig;
	}

	private getMessage(): MessageComponent {
		const factory = this.cfr.resolveComponentFactory(MessageComponent);
		this.componentRef = factory.create(this.injector);
		this.appRef.attachView(this.componentRef.hostView);
		this.rd2.appendChild(this.doc.body, this.componentRef.location.nativeElement);
		const {instance} = this.componentRef;
		this.componentRef.onDestroy(() => {
			console.log('已销毁');
		});
		instance.destroyComponent.subscribe(() => {
			this.destroy();
		});
		return instance;
	}

	destroy(): void {
		this.componentRef.destroy();
		this.message = null;
	}
}
