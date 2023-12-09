import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	Inject,
	Input,
	OnChanges,
	OnDestroy,
	PLATFORM_ID,
	SimpleChanges
} from '@angular/core';
import {DOCUMENT, isPlatformBrowser} from "@angular/common";
import {debounceTime, fromEvent, Subscription} from "rxjs";

export type ScrollEl = Element | Window;
export type EasingFn = (t: number, b: number, c: number, d: number) => number;

function easeInOutCubic(t: number, b: number, c: number, d: number): number {
	const cc = c - b;
	let tt = t / (d / 2);
	if (tt < 1) {
		return (cc / 2) * tt * tt * tt + b;
	} else {
		return (cc / 2) * ((tt -= 2) * tt * tt + 2) + b;
	}
}

@Component({
	selector: 'app-back-top',
	templateUrl: './back-top.component.html',
	styleUrls: ['./back-top.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class BackTopComponent implements OnChanges , AfterViewInit, OnDestroy{
	@Input() target: string | HTMLElement;
	@Input() visibleHeight: number = 450;
	private scrollElement: ScrollEl;
	visible:boolean = false;
	scrollSubscription: Subscription;
	constructor(
		@Inject(PLATFORM_ID) private platformId: object,
		@Inject(DOCUMENT) private doc: Document,
		private cdr:ChangeDetectorRef,
	) {
		this.scrollElement = window;
	}
	clickHandle(): void {
		if (isPlatformBrowser(this.platformId)) {
			this.scrollTo(this.scrollElement);
		}
	}

	private scrollTo(container: ScrollEl, targetTop?: number, easing?: EasingFn, callback?: () => void): void {
		const scrollTop = this.getScroll(container, true);
		const startScrollTime: number = Date.now();
		const frameFunc = () => {
			const durationTime: number = Date.now() - startScrollTime;
			const topValue: number = (easing || easeInOutCubic)(durationTime, scrollTop, targetTop || 0, 500);
			this.setScroll(container, topValue);
			if (durationTime < 500) {
				requestAnimationFrame(frameFunc);
			} else {
				callback && callback();
			}
		};
		requestAnimationFrame(frameFunc);
	}

	private getScroll(target: ScrollEl, isTop: boolean): number {
		const windowProp = isTop ? 'pageYOffset' : 'pageXOffset';
		const elementProp = isTop ? 'scrollTop' : 'scrollLeft';
		return target === window ? target[windowProp] : target[elementProp];
	}

	private setScroll(target: ScrollEl, topValue: number): void {
		if (target === window) {
			this.doc.body.scrollTop = topValue;
			this.doc.documentElement.scrollTop = topValue;
		} else {
			(target as HTMLElement).scrollTop = topValue;
		}
	}

	private addListerScrollEvent() : void {
		this.scrollSubscription = fromEvent(this.scrollElement, 'scroll')
			.pipe(debounceTime(200))
			.subscribe(() => {
				const scrollTop = this.getScroll(this.scrollElement, true);
				this.visible = scrollTop > this.visibleHeight;
				this.cdr.markForCheck();
			})
	}

	ngOnChanges(changes: SimpleChanges): void {
		const {target} = changes;
		if (target) {
			const tempTarget = typeof target.currentValue === 'string' ? this.doc.documentElement.querySelector(target.currentValue) : target.currentValue;
			this.scrollElement = tempTarget || window;
		}
	}

	ngAfterViewInit(): void {
		if (isPlatformBrowser(this.platformId)) {
			this.addListerScrollEvent();
		}
	}

	ngOnDestroy(): void {
		this.scrollSubscription && this.scrollSubscription.unsubscribe();
	}

}
