import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AlbumArgs, AlbumService, CategoryInfo} from "../../services/apis/album.service";
import {MetaValue, SubCategory} from "../../services/apis/types";
import {ActivatedRoute} from "@angular/router";

@Component({
	selector: 'app-albums',
	templateUrl: './albums.component.html',
	styleUrls: ['./albums.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
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

	constructor(
		private albumServe: AlbumService,
		private cdr: ChangeDetectorRef,
		private route: ActivatedRoute,
	) {
	}

	ngOnInit() {
		this.route.paramMap.subscribe(paramsMap => {
			this.searchParams.category = paramsMap.get('pinyin');
			this.updatePageData();
		})
	}

	public changeSubCategory(subCategory?: SubCategory): void {
		if (this.searchParams.subcategory !== subCategory?.code) {
			this.searchParams.subcategory = subCategory?.code || '';
			this.updatePageData();
		}
	}

	private updatePageData(): void {
		this.albumServe.detailCategoryPageInfo(this.searchParams).subscribe(categoryInfo => {
			this.categoryInfo = categoryInfo;
			this.cdr.markForCheck();
		})
	}

	public trackBySubCategory(index, subCategory: SubCategory): string { return subCategory.code; }
	public trackByMetaValues(index, metaValue: MetaValue): number { return metaValue.id; }

}
