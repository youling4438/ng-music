import {Inject, Injectable} from '@angular/core';
import {DOCUMENT} from "@angular/common";


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

@Injectable({
	providedIn: 'root'
})
export class ScrollService {

	constructor(@Inject(DOCUMENT) private doc: Document,) {
	}

	scrollTo(container: ScrollEl, targetTop?: number, easing?: EasingFn, callback?: () => void): void {
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

	getScroll(target: ScrollEl, isTop: boolean): number {
		const windowProp = isTop ? 'pageYOffset' : 'pageXOffset';
		const elementProp = isTop ? 'scrollTop' : 'scrollLeft';
		return target === window ? target[windowProp] : target[elementProp];
	}

	setScroll(target: ScrollEl, topValue: number): void {
		if (target === window) {
			this.doc.body.scrollTop = topValue;
			this.doc.documentElement.scrollTop = topValue;
		} else {
			(target as HTMLElement).scrollTop = topValue;
		}
	}

}
