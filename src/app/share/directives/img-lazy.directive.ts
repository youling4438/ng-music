import {AfterViewInit, Directive, ElementRef, HostBinding, Input, OnDestroy, Renderer2} from '@angular/core';

@Directive({
	selector: '[appImgLazy]'
})
export class ImgLazyDirective implements AfterViewInit, OnDestroy {
	@HostBinding('attr.src') defaultSrc: string = '../../../assets/images/default-pic.jpg';
	@Input('appImgLazy') realSrc: string;
	private io: IntersectionObserver;
	private changeTimes: number = 0;
	private hostEl: HTMLElement;
	private imgLoadHandle: () => void;

	constructor(
		private el: ElementRef,
		private rd2: Renderer2,
	) {
	}

	private changeImgSrc(): void {
		this.changeTimes++;
		const img = new Image();
		img.src = this.realSrc;
		this.imgLoadHandle = this.rd2.listen(img, 'load', () => {
			this.rd2.setProperty(this.hostEl, 'src', this.realSrc);
		});
	}

	ngAfterViewInit(): void {
		this.hostEl = this.el.nativeElement;
		this.io = new IntersectionObserver(entries => {
			const intersectionRatio = entries[0].intersectionRatio;
			if (intersectionRatio > 0 && this.changeTimes === 0) {
				this.changeImgSrc();
			}
		});
		this.io.observe(this.hostEl);
	}

	ngOnDestroy(): void {
		this.io.unobserve(this.hostEl);
		this.imgLoadHandle();
	}

}
