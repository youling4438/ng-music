import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AlbumArgs, AlbumService, CategoryInfo} from "../../services/apis/album.service";
import {MetaValue, SubCategory} from "../../services/apis/types";
import {ActivatedRoute, Router} from "@angular/router";
import {CategoryService} from "../../services/business/category.service";
import {withLatestFrom} from "rxjs/operators";

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
					this.categoryServe.setSubCategory([]);
					this.updatePageData();
				}
			)
	}

	public changeSubCategory(subCategory?: SubCategory): void {
		if (this.searchParams.subcategory !== subCategory?.code) {
			this.searchParams.subcategory = subCategory?.code || '';
			this.categoryServe.setSubCategory([subCategory.displayValue]);
			this.updatePageData();
		}
	}

	private updatePageData(): void {
		this.albumServe.detailCategoryPageInfo(this.searchParams).subscribe(categoryInfo => {
			this.categoryInfo = categoryInfo;
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
