import {
	ApplicationRef,
	ComponentFactoryResolver,
	ComponentRef,
	Inject,
	Injectable,
	Injector,
	Renderer2,
	RendererFactory2
} from '@angular/core';
import {MessageModule} from "./message.module";
import {MessageComponent} from "./message.component";
import {DOCUMENT} from "@angular/common";
import {uniqueId} from "lodash";
import {Subject} from "rxjs";

@Injectable({
	providedIn: MessageModule,
})
export class MessageService {
	private message: MessageComponent;
	private rd2: Renderer2;
	private componentRef: ComponentRef<MessageComponent>;

	constructor(
		@Inject(DOCUMENT) private doc: Document,
		private rd2Factory: RendererFactory2,
		private cfr: ComponentFactoryResolver,
		private injector: Injector,
		private appRef: ApplicationRef,
	) {
		this.rd2 = this.rd2Factory.createRenderer(null, null);
	}

	create(): MessageComponent {
		if (!this.message) {
			this.message = this.getMessage();
		}
		this.message.createMessage({
			messageId: uniqueId('message_'),
			content: uniqueId('Thomas_'),
			onClose: new Subject<void>(),
		});

		return this.message;
	}

	private getMessage(): MessageComponent {
		const factory = this.cfr.resolveComponentFactory(MessageComponent);
		this.componentRef = factory.create(this.injector);
		this.appRef.attachView(this.componentRef.hostView);
		this.rd2.appendChild(this.doc.body, this.componentRef.location.nativeElement);
		return this.componentRef.instance;
	}
}
