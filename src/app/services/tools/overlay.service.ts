import {Inject, Injectable, PLATFORM_ID, Renderer2, RendererFactory2} from '@angular/core';
import {DOCUMENT, isPlatformBrowser} from "@angular/common";
import {first, fromEvent, merge, Observable, Subject, takeUntil, timer} from "rxjs";

export interface OverlayConfig {
	center?: boolean;
	fade?: boolean;
	backgroundColor?: string;
}

export interface OverlayRef {
	container: HTMLDivElement,
	backdropClick: () => Observable<MouseEvent>,
	backdropKeyup: () => Observable<KeyboardEvent>,
	close: () => Observable<void>,
}

@Injectable({
	providedIn: 'root',
})
export class OverlayService {
	private rd2: Renderer2;
	private isBrowser: boolean;
	readonly defaultConfig: Required<OverlayConfig> = {
		center: false,
		fade: false,
		backgroundColor: 'rgba(0,0,0,.32)',
	};
	config: Required<OverlayConfig>;
	private backdropElement: HTMLDivElement;
	private detachment$ = new Subject<void>();
	private backdropClick$ = new Subject<MouseEvent>();
	private backdropKeyup$ = new Subject<KeyboardEvent>();
	private overlayRef: OverlayRef;

	constructor(
		private rdFactory2: RendererFactory2,
		@Inject(DOCUMENT) private doc: Document,
		@Inject(PLATFORM_ID) private platformId: object,
	) {
		this.rd2 = this.rdFactory2.createRenderer(null, null);
		this.isBrowser = isPlatformBrowser(this.platformId);
	}

	create(overlayConfig?: OverlayConfig): OverlayRef {
		if (this.isBrowser) {
			this.config = {...this.defaultConfig, ...overlayConfig};
			const container: HTMLDivElement = this.rd2.createElement('div');
			this.rd2.addClass(container, 'overlay-container');
			container.innerHTML = '<div class="overlay-mask"></div>';
			this.rd2.appendChild(this.doc.body, container);
			this.backdropElement = container.querySelector('.overlay-mask');
			this.setConfig(container);
			this.listenEvents();
			this.overlayRef = {
				container,
				backdropClick: this.backdropClick.bind(this),
				backdropKeyup: this.backdropKeyup.bind(this),
				close: this.closeOverlay.bind(this),
			};
			return this.overlayRef;
		}
		return null;
	}


	private setConfig(container: HTMLDivElement): void {
		const {fade, center, backgroundColor} = this.config;
		if (center) {
			this.rd2.addClass(container, 'overlay-center');
		}
		if (fade) {
			timer(0)
				.pipe(first())
				.subscribe(() => {
						this.rd2.addClass(this.backdropElement, 'overlay-mask-show');
					}
				);
		}
		if (backgroundColor) {
			this.rd2.setStyle(this.backdropElement, 'backgroundColor', backgroundColor);
		}

	}

	private listenEvents(): void {
		merge(
			fromEvent(this.backdropElement, 'click'),
			fromEvent(this.doc, 'keyup'),
		).pipe(takeUntil(this.detachment$)).subscribe((event: MouseEvent | KeyboardEvent) => {
			if (event instanceof MouseEvent) {
				this.backdropClick$.next(event);
			} else {
				this.backdropKeyup$.next(event);
			}
		});
	}

	private backdropClick(): Observable<MouseEvent> {
		return this.backdropClick$.asObservable();
	}

	private backdropKeyup(): Observable<KeyboardEvent> {
		return this.backdropKeyup$.asObservable();
	}

	closeOverlay(): void {
		if(this.overlayRef){
			this.detachment$.next();
			this.detachment$.complete();
			this.rd2.removeChild(this.doc.body, this.overlayRef.container);
			this.overlayRef = null;
		}
	}

}
