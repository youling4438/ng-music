import {Directive, ElementRef, EventEmitter, Input, OnChanges, Output, Renderer2, SimpleChanges} from '@angular/core';
import {timer} from "rxjs";

@Directive({
	selector: '[appToggleMore]'
})
export class ToggleMoreDirective implements OnChanges {
	@Input() content: string;
	@Input() isFull: boolean = false;
	@Input('appToggleMore') maxHeight: number = 0;
	private trueHeight: number;
	@Output() domInitHeight = new EventEmitter<number>();


	constructor(
		private el: ElementRef,
		private rd2: Renderer2,
	) {
	}

	ngOnChanges(changes: SimpleChanges): void {
		const {content, isFull,} = changes;
		if (content?.currentValue) {
			timer(800).subscribe(() => {
				const rect = this.domRect(this.el.nativeElement);
				this.trueHeight = rect.height;
				this.domInitHeight.emit(this.trueHeight);
			});
		}
		if (isFull) {
			const height: number = isFull.currentValue ? this.trueHeight : this.maxHeight;
			this.rd2.setStyle(this.el.nativeElement, 'maxHeight', height + 'px');
		}
	}

	domRect(el: HTMLElement): DOMRect {
		const cloneNode = el.cloneNode(true) as HTMLElement;
		this.rd2.setStyle(cloneNode, 'position', 'absolute');
		this.rd2.setStyle(cloneNode, 'visibility', 'hidden');
		this.rd2.setStyle(cloneNode, 'pointerEvents', 'none');
		this.rd2.setStyle(cloneNode, 'maxHeight', 'unset');
		this.rd2.appendChild(el.parentNode, cloneNode);
		const rect = cloneNode.getBoundingClientRect();
		this.rd2.removeChild(el.parentNode, cloneNode);
		return rect;
	}
}
