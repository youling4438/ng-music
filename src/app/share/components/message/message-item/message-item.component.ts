import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit,} from '@angular/core';
import {MessageItemData} from "../types";
import {MessageComponent} from "../message.component";
import {first, Subscription, timer} from "rxjs";
import {animate, AnimationEvent, style, transition, trigger} from "@angular/animations";

@Component({
	selector: 'app-message-item',
	templateUrl: './message-item.component.html',
	styleUrls: ['./message-item.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('moveUpDown', [
			transition('* => enter', [
				style({
					opacity: 0,
					transform: 'translateY(-100%)',
				}),
				animate('.3s', style({
					opacity: 1,
					transform: 'translateY(0)',
				})),
			]),
			transition('* => leave', [
				animate('.3s', style({
					opacity: 0,
					transform: 'translateY(-100%)',
				})),
			])
		])
	],
})

export class MessageItemComponent implements OnInit, OnDestroy {
	@Input() message: MessageItemData;
	@Input() index: number;
	private autoClose: boolean = false;
	private timerSub: Subscription;

	constructor(
		private parent: MessageComponent,
		private cdr: ChangeDetectorRef,
	) {
	}

	ngOnInit(): void {
		this.autoClose = this.message.options.duration > 0;
		if (this.autoClose) {
			this.createTimer(this.message.options.duration);
		}
	}

	private createTimer(duration: number): void {
		this.timerSub = timer(duration).pipe(first()).subscribe(() => this.close());
	}

	private clearTimer(): void {
		if (this.timerSub) {
			this.timerSub.unsubscribe();
			this.timerSub = null;
		}
	}

	get className(): string {
		return 'app-message clearfix ' + this.message.options.type;
	}

	close(): void {
		this.message.options.state = 'leave';
		this.cdr.markForCheck();
	}

	enter(): void {
		if (this.autoClose && this.message.options.pauseOnHover) {
			this.clearTimer();
		}
	}

	leave(): void {
		if (this.autoClose && this.message.options.pauseOnHover) {
			this.createTimer(this.message.options.duration);
		}
	}

	animationDone(event: AnimationEvent): void {
		if(event.toState === 'leave'){
			this.parent.removeMessage(this.message.messageId);
		}
	}

	ngOnDestroy(): void {
		this.clearTimer();
	}

}
