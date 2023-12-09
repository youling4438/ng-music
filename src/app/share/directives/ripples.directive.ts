import {Directive, HostBinding, HostListener, Renderer2} from '@angular/core';

@Directive({
	selector: '[appRipples]'
})
export class RipplesDirective {
	@HostBinding('style.position') readonly position = 'relative';
	@HostBinding('style.overflow') readonly overflow = 'hidden';

	constructor(
		private rd2: Renderer2,
	) {
	}

	@HostListener('click', ['$event'])
	clickHandle(event: MouseEvent): void {
		const target = event.target as HTMLElement;
		const {left, top,} = target.getBoundingClientRect();
		const x = event.clientX - left;
		const y = event.clientY - top;
		const ripples = this.rd2.createElement('span');
		this.rd2.addClass(ripples, 'app-ripples');
		this.rd2.setStyle(ripples, 'left', x + 'px');
		this.rd2.setStyle(ripples, 'top', y + 'px');
		this.rd2.appendChild(target,ripples);
		this.rd2.listen(ripples, 'animationend', () => {
			this.rd2.removeChild(target, ripples);
		});
	}

}
