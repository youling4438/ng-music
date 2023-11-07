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
	@Input() total: number = 500;
	@Input() pageNum: number = 5;
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
		if (lastNum <= 9) {
			const list = this.generatorPageItem(1, lastNum);
			return this.concatPrevNextBtn(list, pageNum, lastNum);
		} else {
			const firstPageItem: PageItem[] = this.generatorPageItem(1, 1);
			const lastPageItem: PageItem[] = this.generatorPageItem(lastNum, lastNum);
			const prev5PageItem: PageItem = {type: 'prev5',};
			const next5PageItem: PageItem = {type: 'next5',};
			let midPageItem: PageItem[] = [];
			if (pageNum <= 4) {
				midPageItem = [
					...this.generatorPageItem(2, 5),
					next5PageItem,
				];
			} else if (pageNum > lastNum - 4) {
				midPageItem = [
					prev5PageItem,
					...this.generatorPageItem(lastNum - 4, lastNum - 1),
				];
			} else {
				midPageItem = [
					prev5PageItem,
					...this.generatorPageItem(pageNum - 2, pageNum + 2),
					next5PageItem,
				];
			}
			const list: PageItem[] = [
				...firstPageItem,
				...midPageItem,
				...lastPageItem,
			];
			return this.concatPrevNextBtn(list, pageNum, lastNum);
		}
	}

	private concatPrevNextBtn(list: PageItem[], pageNum: number, lastNum: number): PageItem[] {
		return [
			{
				type: 'prev',
				disabled: pageNum === 1,
			},
			...list,
			{
				type: 'next',
				disabled: pageNum === lastNum,
			},
		]
	}
}
