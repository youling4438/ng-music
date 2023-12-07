import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AlbumArgs, AlbumService, AlbumsInfo, CategoryInfo} from "../../services/apis/album.service";
import {Album, MetaData, MetaValue, SubCategory} from "../../services/apis/types";
import {CategoryService} from "../../services/business/category.service";
import {withLatestFrom} from "rxjs/operators";
import {WindowService} from "../../services/tools/window.service";
import {storageKeys} from "../../share/config";
import {forkJoin} from "rxjs";
import {IconType} from "../../share/directives/icon/types";
import {ActivatedRoute} from "@angular/router";
import {PlayerService} from "../../services/business/player.service";

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
		perPage: 30,
	};
	total: number = 0;
	categoryInfo: CategoryInfo;
	checkedMetas: CheckedMeta[] = [];
	albumsInfo: AlbumsInfo;
	sorts = ['综合排序', '最近更新', '播放最多'];
	currentIcon: IconType = 'headset';

	constructor(
		private albumServe: AlbumService,
		private cdr: ChangeDetectorRef,
		private route: ActivatedRoute,
		private categoryServe: CategoryService,
		private winServe: WindowService,
		private playerServe: PlayerService,
	) {
	}

	ngOnInit() {
		this.route.paramMap.pipe(withLatestFrom(this.categoryServe.getCategory()))
			.subscribe(([paramsMap, category]) => {
					const pinyin = paramsMap.get('pinyin');
					this.searchParams.category = pinyin;
					let needSetStatus: boolean = false;
					if (pinyin !== category) {
						this.categoryServe.setCategory(pinyin);
						this.clearSubcategory();
						this.unCheckMeta('clear');
					} else {
						const cacheCode = this.winServe.getStorage(storageKeys.subcategoryCode);
						if (cacheCode) {
							needSetStatus = true;
							this.searchParams.subcategory = cacheCode;
						} else {
							this.clearSubcategory();
						}
						const cacheMetas = this.winServe.getStorage(storageKeys.metas);
						if (cacheMetas) {
							needSetStatus = true;
							this.searchParams.meta = cacheMetas;
						}
					}
					this.updatePageData(needSetStatus);
				}
			)
	}

	public changeSubCategory(subCategory?: SubCategory): void {
		if (subCategory) {
			this.searchParams.subcategory = subCategory.code;
			this.categoryServe.setSubCategory([subCategory.displayValue]);
			this.winServe.setStorage(storageKeys.subcategoryCode, this.searchParams.subcategory);
		} else {
			this.clearSubcategory();
		}
		this.unCheckMeta('clear');
		this.updatePageData();
	}

	changeMeta(metaData: MetaData, metaValue: MetaValue): void {
		this.checkedMetas.push({
			metaId: metaValue.id,
			metaName: metaValue.displayName,
			metaRowId: metaData.id,
			metaRowName: metaData.name,
		});
		this.searchParams.meta = this.getMetaParam();
		this.winServe.setStorage(storageKeys.metas, this.searchParams.meta);
		this.searchParams.sort = 0;
		this.updatePageData();
	}

	playAlbum(event: MouseEvent, albumId: number): void {
		event.stopPropagation();
		this.albumServe.album(`${albumId}`).subscribe(({mainInfo, tracksInfo}) => {
			this.playerServe.setAlbum({ ...mainInfo, albumId});
			this.playerServe.setTrackList(tracksInfo.tracks);
			this.playerServe.setCurrentIndex(0);
		});
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
			this.winServe.removeStorage(storageKeys.metas);
		} else {
			const targetIndex: number = this.checkedMetas.findIndex(item => meta.metaId === item.metaId && meta.metaRowId === item.metaRowId);
			if (targetIndex > -1) {
				this.checkedMetas.splice(targetIndex, 1);
				this.searchParams.meta = this.getMetaParam();
				this.winServe.setStorage(storageKeys.metas, this.searchParams.meta);
			}
		}
		this.searchParams.sort = 0;
		this.updatePageData();
	}

	pageChanged(newPageNum: number): void {
		this.searchParams.page = newPageNum;
		this.updateAlbums();
	}

	private updateAlbums(): void {
		this.albumServe.albums(this.searchParams).subscribe((albumsInfo: AlbumsInfo) => {
			this.albumsInfo = albumsInfo;
			this.total = albumsInfo.total;
			this.cdr.markForCheck();
		});
	}

	changeSort(sortIndex: number): void {
		if (sortIndex !== this.searchParams.sort) {
			this.searchParams.sort = sortIndex;
		}
	}

	showMetaRow(rowName: string): boolean {
		if (this.checkedMetas.length) {
			return this.checkedMetas.findIndex(meta => meta.metaRowName === rowName) === -1;
		}
		return true;
	}

	private updatePageData(needSetStatus: boolean = false): void {
		this.searchParams.page = 1;
		forkJoin([
			this.albumServe.albums(this.searchParams),
			this.albumServe.detailCategoryPageInfo(this.searchParams),
		]).subscribe(([albumsInfo, categoryInfo]) => {
			this.albumsInfo = albumsInfo;
			this.total = albumsInfo.total;
			this.categoryInfo = categoryInfo;
			if (needSetStatus) {
				this.setStatus(categoryInfo);
			}
			this.cdr.markForCheck();
		});
	}

	private setStatus(categoryInfo: CategoryInfo): void {
		const {metadata, subcategories} = categoryInfo;
		const subCategory = subcategories.find(item => item.code === this.searchParams.subcategory);
		if (subCategory) {
			this.categoryServe.setSubCategory([subCategory.displayValue]);
		}
		if (this.searchParams.meta) {
			const metaMaps = this.searchParams.meta.split('-').map(_item => _item.split('_'));
			metaMaps.forEach(meta => {
				const targetRow = metadata.find(row => row.id === Number(meta[0]));
				const {id: metaRowId, name, metaValues} = targetRow || metadata[0];
				const targetMeta = metaValues.find(metaItem => metaItem.id === Number(meta[1]));
				const {id, displayName} = targetMeta || metaValues[0];
				this.checkedMetas.push({
					metaRowId: metaRowId,
					metaRowName: name,
					metaId: id,
					metaName: displayName,
				});
			})
		}
	}


	private clearSubcategory(): void {
		this.searchParams.subcategory = '';
		this.categoryServe.setSubCategory([]);
		this.winServe.removeStorage(storageKeys.subcategoryCode);
	}

	public trackBySubCategory(index: number, subCategory: SubCategory): string {
		return subCategory.code;
	}

	public trackByMetaValues(index: number, metaValue: MetaValue): number {
		return metaValue.id;
	}

	public trackByAlbums(index: number, album: Album): number {
		return album.albumId;
	}

}
