import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	OnDestroy,
	QueryList,
	ViewChildren
} from '@angular/core';
import {fromEvent, Observable, Subject, takeUntil} from "rxjs";
import {withLatestFrom} from "rxjs/operators";

@Component({
	selector: 'app-expand',
	templateUrl: './expand.component.html',
	styleUrl: './expand.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpandComponent implements AfterViewInit, OnDestroy {
	@ViewChildren('btn') readonly buttons: QueryList<ElementRef<HTMLButtonElement>>;
	destroy$ = new Subject<void>();

	showBox: boolean = false;
	list: string[] = [];

	ngAfterViewInit(): void {
		const sub1: Observable<any> = fromEvent(this.buttons.first.nativeElement, 'click');
		const sub2: Observable<any> = fromEvent(this.buttons.last.nativeElement, 'click');
		sub1.pipe(takeUntil(this.destroy$)).subscribe(btn1click => {
			console.log('res btn1', btn1click);
		});
		sub2.pipe(takeUntil(this.destroy$)).subscribe(btn2click => {
			console.log('res btn2', btn2click);
		});
		sub1.pipe(withLatestFrom(sub2)).pipe(takeUntil(this.destroy$)).subscribe(buttonsClickEvents => {
			console.log('----------------buttonsClickEvents-------------------- : ', buttonsClickEvents);
		});

		this.mockListData();
	}

	addList(count = 100): void {
		const length: number = this.list.length;
		for (let i = 0; i < count; i++) {
			this.list.push(`item${i + length}`);
		}
		this.list = this.list.slice();
	}

	subList(count = 100): void {
		this.list.splice(0, count);
		this.list = this.list.slice();
	}

	mockListData(length = 200): void {
		this.list = [];
		for (let i = 0; i < length; i++) {
			this.list.push('item' + i);
		}
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

}
