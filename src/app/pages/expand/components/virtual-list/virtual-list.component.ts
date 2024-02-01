import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component, ElementRef,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges,
	TemplateRef,
	ViewChild
} from '@angular/core';
import {ScrollService} from "../../../../services/tools/scroll.service";

interface VirtualBase {
	start: number;
	end: number;
	paddingTop: number;
	paddingBottom: number;
	scrollTop: number;
}

interface VirtualItemContext {
	item: any;
	index: number;
}

@Component({
	selector: 'app-virtual-list',
	templateUrl: './virtual-list.component.html',
	styleUrl: './virtual-list.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class VirtualListComponent implements OnInit, OnChanges, AfterViewInit {
	@Input() list: any[];
	@Input() itemTpl: TemplateRef<VirtualItemContext>;
	@Input() size: number;
	@Input() remain: number;
	@Input() additional: number;  //额外渲染多少条数据
	@Input() start: number = 0;  //从第几条开始渲染
	@Input() offset: number = 0;  //默认的scrollTop
	@ViewChild('virtualWrap') readonly virtualWrap: ElementRef<HTMLElement>;
	base: VirtualBase = {
		start: 0,
		end: 0,
		paddingBottom: 0,
		paddingTop: 0,
		scrollTop: 0,
	};
	renderList: any[];

	constructor(private scrollServe: ScrollService) {
	}

	ngOnChanges(changes: SimpleChanges): void {
		const {list} = changes;
		if (list && !list.firstChange) {
			this.onListScroll(true);
		}
	}

	ngOnInit(): void {
		this.refresh(true);
	}

	private updateContainer(): void {
		const total = this.list.length;
		const needPadding = total > this.keeps;
		const paddingTop = this.size * (needPadding ? this.base.start : 0);
		let paddingBottom = this.size * (needPadding ? total - this.keeps - this.base.start : 0);
		if (paddingBottom < this.size) {
			paddingBottom = 0;
		}
		this.base.paddingTop = paddingTop;
		this.base.paddingBottom = paddingBottom;
	}

	private filterList(): any[] {
		if (this.list.length) {
			const list: any[] = [];
			for (let i = this.base.start; i <= this.base.end; i++) {
				list.push(this.list[i]);
			}
			return list;
		}
		return [];
	}

	private getEndIndex(start: number): number {
		const end = start + this.keeps - 1;
		return this.list.length ? Math.min(end, this.list.length - 1) : end;
	}

	get maxHeight(): number {
		return this.size * this.remain;
	}

	get keeps(): number {
		return this.remain + (this.additional || this.remain);
	}

	onListScroll(forceUpdate = false): void {
		if (this.list.length > this.keeps) {
			this.updateZone(this.virtualWrap.nativeElement.scrollTop, forceUpdate);
		} else {
			this.refresh();
		}
	}

	private refresh(init = false) {
		if (init) {
			this.base.start = this.list.length > this.start + this.keeps ? this.start : 0;
		} else {
			this.base.start = 0;
		}
		this.base.end = this.getEndIndex(this.base.start);
		this.updateContainer();
		this.renderList = this.filterList();
	}

	private updateZone(offset: number, forceUpdate: boolean): void {
		const overs = Math.floor(offset / this.size);
		const zone = this.getZone(overs);
		let shouldRefresh = false;
		if (forceUpdate) {
			shouldRefresh = true;
		} else {
			if (overs < this.base.start) {
				// 向上滚动
				shouldRefresh = true;
			} else {
				if (zone.isLastZone) {
					if ((this.base.start !== zone.start) || (this.base.end !== zone.end)) {
						shouldRefresh = true;
					}
				} else {
					const additional = this.additional || this.remain;
					shouldRefresh = overs > this.base.start + additional;
				}
			}
		}

		if (shouldRefresh) {
			this.base.start = zone.start;
			this.base.end = zone.end;
			this.updateContainer();
			this.renderList = this.filterList();
		}

	}

	ngAfterViewInit(): void {
		if (this.start) {
			this.scrollServe.setScroll(this.virtualWrap.nativeElement, this.getZone(this.start).start * this.size);
		} else if (this.offset) {
			this.scrollServe.setScroll(this.virtualWrap.nativeElement, this.offset);
		}
	}

	private getZone(startIndex: number): { start: number, end: number, isLastZone: boolean } {
		let start = Math.max(0, startIndex);
		const remainCount = this.list.length - this.keeps;
		const isLastZone: boolean = start >= remainCount;
		if (isLastZone) {
			start = Math.max(0, remainCount);
		}
		return {
			start,
			end: this.getEndIndex(start),
			isLastZone,
		}
	}
}
