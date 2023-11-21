import {
	AfterViewInit,
	ContentChildren,
	Directive,
	ElementRef,
	HostListener,
	Inject,
	PLATFORM_ID, QueryList,
	Renderer2,
} from '@angular/core';
import {DOCUMENT, isPlatformBrowser} from "@angular/common";
import {DragHandleDirective} from "./drag-handle.directive";

interface StartPosition {
	clientX: number,
	clientY: number,
	top: number,
	left: number,
}

@Directive({
	selector: '[appDrag]'
})
export class DragDirective implements AfterViewInit {
	startPosition: StartPosition;
	readonly isBrowser: boolean;
	private hostElement: HTMLElement;
	private movable: boolean;
	private mouseMoveHandle: () => void;
	private mouseUpHandle: () => void;
	@ContentChildren(DragHandleDirective, {descendants: true}) private handles: QueryList<DragHandleDirective>;

	constructor(
		private el: ElementRef,
		private rd2: Renderer2,
		@Inject(DOCUMENT) private doc: Document,
		@Inject(PLATFORM_ID) private platformId: object,
	) {
		this.isBrowser = isPlatformBrowser(this.platformId);
	}

	@HostListener('mousedown', ['$event'])
	dragStart(event: MouseEvent): void {
		if (this.isBrowser) {
			event.preventDefault();
			event.stopPropagation();
			const canHandleMove = !this.handles.length || this.handles.some(handle => handle.el.nativeElement.contains(event.target));
			if (canHandleMove) {
				const {clientX, clientY} = event;
				const {left, top,} = this.hostElement.getBoundingClientRect();
				this.startPosition = {
					clientX,
					clientY,
					left,
					top,
				};
				this.toggleMove(true);
			}
		}
	}

	toggleMove(movable: boolean): void {
		this.movable = movable;
		if (this.movable) {
			this.mouseMoveHandle = this.rd2.listen(this.doc, 'mousemove', this.mouseMove.bind(this));
			this.mouseUpHandle = this.rd2.listen(this.doc, 'mouseup', this.mouseUp.bind(this));
		} else {
			if (this.mouseMoveHandle) {
				this.mouseMoveHandle();
			}
			if (this.mouseUpHandle) {
				this.mouseUpHandle();
			}
		}
	}

	private mouseMove(event: MouseEvent): void {
		if (this.isBrowser) {
			event.preventDefault();
			event.stopPropagation();
			const {clientX, clientY} = event;
			const diffX = clientX - this.startPosition.clientX;
			const diffY = clientY - this.startPosition.clientY;
			const {top, left} = this.calculate(diffX, diffY);
			this.rd2.setStyle(this.hostElement, 'left', left + 'px');
			this.rd2.setStyle(this.hostElement, 'top', top + 'px');
		}
	}

	private calculate(diffX: number, diffY: number): { left: number, top: number, } {
		return {
			left: this.startPosition.left + diffX,
			top: this.startPosition.top + diffY,
		};
	}

	private mouseUp(): void {
		this.toggleMove(false);
	}

	ngAfterViewInit(): void {
		this.hostElement = this.el.nativeElement;
		this.setHandleMouseStyle();
	}

	private setHandleMouseStyle(): void {
		if (this.handles.length) {
			this.handles.forEach(handle => this.rd2.setStyle(handle.el.nativeElement, 'cursor', 'move'));
		} else {
			this.rd2.setStyle(this.hostElement, 'cursor', 'move');
		}
	}

}
