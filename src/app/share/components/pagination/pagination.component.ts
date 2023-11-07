import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';

type PageItemType = 'page' | 'prev' | 'next' | 'prev5' | 'next5';

interface PageItem {
	type: PageItemType;
	disabled?: boolean;
	num?: number;
}

@Component({
	selector: 'app-pagination',
	templateUrl: './pagination.component.html',
	styleUrls: ['./pagination.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent implements OnInit {
	@Input() total: number = 85;
	@Input() pageNum: number = 1;
	@Input() pageSize: number = 10;
	private lastNum = 0;
	listOfPageItem: PageItem[] = [];

	constructor() {
	}

	ngOnInit(): void {
		this.lastNum = Math.ceil(this.total / this.pageSize);
		this.listOfPageItem = this.getListOfPageItem(this.pageNum, this.lastNum);
		console.log('this.listOfPageItem', this.listOfPageItem);
	}

	private generatorPageItem(start: number, end: number): PageItem[] {
		const list: PageItem[] = [];
		for (let i = start; i <= end; i++) {
			list.push({
				num: i,
				type: 'page',
			});
		}
		return list;
	}

	private getListOfPageItem(pageNum: number, lastNum: number): PageItem[] {
		const list = this.generatorPageItem(1, lastNum);
		return this.concatPrevNextBtn(list, pageNum, lastNum);
	}

	private concatPrevNextBtn(list: PageItem[], pageNum: number, lastNum: number): PageItem[] {
		return [
			{
				type: 'prev',
				disabled: pageNum === 1,
			},
			{
				type: 'prev5',
			},
			...list,
			{
				type: 'next5',
			},
			{
				type: 'next',
				disabled: pageNum === lastNum,
			},
		]
	}
}
