import {ChangeDetectionStrategy, Component, Inject, Input, OnChanges, PLATFORM_ID, SimpleChanges} from '@angular/core';
import {DOCUMENT, isPlatformBrowser} from "@angular/common";

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
export class BackTopComponent implements OnChanges {
	@Input() target: string | HTMLElement;
	private scrollElement: ScrollEl;

	constructor(
		@Inject(PLATFORM_ID) private platformId: object,
		@Inject(DOCUMENT) private doc: Document,
	) {
		this.scrollElement = window;
	}

	ngOnChanges(changes: SimpleChanges): void {
		const {target} = changes;
		if (target) {
			const tempTarget = typeof target.currentValue === 'string' ? this.doc.documentElement.querySelector(target.currentValue) : target.currentValue;
			this.scrollElement = tempTarget || window;
		}
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
}
