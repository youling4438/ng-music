import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef, EventEmitter,
	Inject, OnInit,
	Output,
} from '@angular/core';
import {User} from "../../services/apis/types";
import {DOCUMENT} from "@angular/common";
import {debounceTime, distinctUntilChanged, fromEvent} from "rxjs";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {ContextService} from "../../services/business/context.service";

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('moveUpMotion', [
			state('1', style({
				position: 'fixed',
				top: 0,
				width: '100%',
				zIndex: 1,
			})),
			transition('* => 1', [
				style({
					transform: 'translateY(-100%)',
					opacity: 0,
				}),
				animate('300ms ease-out'),
			]),
		])
	]
})
export class HeaderComponent implements OnInit, AfterViewInit {
	user: User;
	fix: boolean = false;
	@Output() loginClickHandle = new EventEmitter<void>();
	@Output() logoutClickHandle = new EventEmitter<void>();

	constructor(
		private el: ElementRef,
		@Inject(DOCUMENT) private doc: Document,
		private cdr: ChangeDetectorRef,
		private ContextServe: ContextService,
	) {
	}

	ngOnInit(): void {
		this.ContextServe.getUser().subscribe(user => {
			this.user = user;
			this.cdr.markForCheck();
		});
	}

	ngAfterViewInit(): void {
		fromEvent(this.doc, 'scroll')
			.pipe(
				debounceTime(300),
				distinctUntilChanged(),
			)
			.subscribe(() => {
				const scrollTop = this.doc.documentElement.scrollTop;
				const clientHeight = this.el.nativeElement.clientHeight;
				this.fix = scrollTop > (clientHeight + 100);
				this.cdr.markForCheck();
			});
	}
}
