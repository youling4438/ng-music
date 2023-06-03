import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AlbumArgs, AlbumService, AlbumsInfo, CategoryInfo} from "../../services/apis/album.service";
import {MetaData, MetaValue, SubCategory} from "../../services/apis/types";
import {CategoryService} from "../../services/business/category.service";
import {forkJoin} from "rxjs";
import {withLatestFrom} from "rxjs/operators";

interface CheckedMeta {
	metaRowId: number;
	metaRowName: string;
	metaId: number;
	metaName: string;
}

@Component({
	selector: 'app-albums',
	templateUrl: './albums.component.html',
	styleUrls: ['./albums.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlbumsComponent implements OnInit {
	searchParams: AlbumArgs = {
		category: '',
		subcategory: '',
		meta: '',
		sort: 0,
		page: 1,
		perPage: 30
	};
	categoryInfo: CategoryInfo;
	checkedMetas: CheckedMeta[] = [];
	albumsInfo: AlbumsInfo;
	sorts = ['综合排序', '最近更新', '播放最多'];

	constructor(
		private albumServe: AlbumService,
		private cdr: ChangeDetectorRef,
		private route: ActivatedRoute,
		private router: Router,
		private categoryServe: CategoryService,
	) {
	}

	ngOnInit() {
		this.route.paramMap.pipe(withLatestFrom(this.categoryServe.getCategory()))
			.subscribe(([paramsMap, category]) => {
					const pinyin = paramsMap.get('pinyin');
					if (pinyin !== category) {
						this.categoryServe.setCategory(pinyin);
					}
					this.searchParams.category = pinyin;
					this.searchParams.subcategory = '';
					this.checkedMetas = [];
					this.searchParams.meta = this.getMetaParam();
					this.categoryServe.setSubCategory([]);
					this.updatePageData();
					this.updateAlbums();
				}
			)
	}

	public changeSubCategory(subCategory?: SubCategory): void {
		if (this.searchParams.subcategory !== subCategory?.code) {
			this.searchParams.subcategory = subCategory?.code || '';
			this.categoryServe.setSubCategory([subCategory?.displayValue]);
			this.updatePageData();
			this.checkedMetas = [];
			this.searchParams.meta = this.getMetaParam();
			this.searchParams.sort = 0;
			this.updateAlbums();
		}
	}

	changeMeta(metaData: MetaData, metaValue: MetaValue): void {
		this.checkedMetas.push({
			metaId: metaValue.id,
			metaName: metaValue.displayName,
			metaRowId: metaData.id,
			metaRowName: metaData.name,
		});
		this.searchParams.meta = this.getMetaParam();
		this.searchParams.sort = 0;
		this.updateAlbums();
	}

	private getMetaParam(): string {
		let paramsMeta = '';
		if (this.checkedMetas.length) {
			this.checkedMetas.forEach(meta => {
				paramsMeta += `${meta.metaRowId}_${meta.metaId}-`;
			});
		}
		return paramsMeta.slice(0, -1);
	}

	unCheckMeta(meta: CheckedMeta | 'clear'): void {
		if (meta === 'clear') {
			this.checkedMetas = [];
			this.searchParams.meta = '';
		} else {
			const targetIndex: number = this.checkedMetas.findIndex(item => meta.metaId === item.metaId && meta.metaRowId === item.metaRowId);
			if (targetIndex > -1) {
				this.checkedMetas.splice(targetIndex, 1);
			}
			this.searchParams.meta = this.getMetaParam();
		}
		this.searchParams.sort = 0;
		this.updateAlbums();
	}

	changeSort(sortIndex: number): void {
		if (sortIndex !== this.searchParams.sort) {
			this.searchParams.sort = sortIndex;
			this.updateAlbums();
		}
	}

	showMetaRow(rowName: string): boolean {
		if (this.checkedMetas.length) {
			return this.checkedMetas.findIndex(meta => meta.metaRowName === rowName) === -1;
		}
		return true;
	}

	private updatePageData(): void {
		this.albumServe.detailCategoryPageInfo(this.searchParams)
			.subscribe(categoryInfo => {
				this.categoryInfo = categoryInfo;
				this.cdr.markForCheck();
			})
	}

	private updateAlbums(): void {
		this.albumServe.albums(this.searchParams).subscribe(albumsInfo => {
			this.albumsInfo = albumsInfo;
			this.cdr.markForCheck();
		})
	}

	public trackBySubCategory(index, subCategory: SubCategory): string {
		return subCategory.code;
	}

	public trackByMetaValues(index, metaValue: MetaValue): number {
		return metaValue.id;
	}

}
