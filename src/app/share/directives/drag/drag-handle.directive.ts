import {Directive, ElementRef} from '@angular/core';
@Directive({
	selector: '[appDragHandle]'
})
export class DragHandleDirective {
	constructor(public el: ElementRef) {
	}

}
