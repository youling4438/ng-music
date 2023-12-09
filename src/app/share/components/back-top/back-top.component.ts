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
import {animate, style, transition, trigger} from "@angular/animations";
import {ScrollEl, ScrollService} from "../../../services/tools/scroll.service";

@Component({
	selector: 'app-back-top',
	templateUrl: './back-top.component.html',
	styleUrls: ['./back-top.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('fadeInOut', [
			transition(':enter', [
				style({opacity: 0}),
				animate('.2s', style({opacity: 1})),
			]),
			transition(':leave', [
				animate('.2s', style({opacity: 0})),
			]),
		])
	],
})
export class BackTopComponent implements OnChanges, AfterViewInit, OnDestroy {
	@Input() target: string | HTMLElement;
	@Input() visibleHeight: number = 450;
	private scrollElement: ScrollEl;
	visible: boolean = false;
	scrollSubscription: Subscription;

	constructor(
		@Inject(PLATFORM_ID) private platformId: object,
		@Inject(DOCUMENT) private doc: Document,
		private cdr: ChangeDetectorRef,
		private scrollServe:ScrollService,
	) {
		this.scrollElement = window;
	}

	clickHandle(): void {
		if (isPlatformBrowser(this.platformId)) {
			this.scrollServe.scrollTo(this.scrollElement);
		}
	}


	private addListerScrollEvent(): void {
		this.scrollSubscription = fromEvent(this.scrollElement, 'scroll')
			.pipe(debounceTime(200))
			.subscribe(() => {
				const scrollTop = this.scrollServe.getScroll(this.scrollElement, true);
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
