import {Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges} from '@angular/core';
import {IconType} from "./types";

@Directive({
	selector: 'i[appIcon]',
	host: {
		'[class.iconfont]': 'true',
	}
})

export class IconDirective implements OnChanges {
	@Input('appIcon') type: IconType;

	constructor(
		private el: ElementRef,
		private rd2: Renderer2,
	) {}

	ngOnChanges(changes: SimpleChanges) {
		const { type } = changes;
		if (type.previousValue) {
			this.rd2.removeClass(this.el.nativeElement, `icon-${type.previousValue}`);
		}
		this.rd2.addClass(this.el.nativeElement, `icon-${type.currentValue}`);
	}
}
