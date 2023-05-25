import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AlbumArgs, AlbumService, CategoryInfo} from "../../services/apis/album.service";

@Component({
	selector: 'app-albums',
	templateUrl: './albums.component.html',
	styleUrls: ['./albums.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlbumsComponent implements OnInit {
	searchParams: AlbumArgs = {
		category: 'youshengshu',
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
	) {
	}

	ngOnInit() {
		this.updatePageData();
	}

	private updatePageData(): void {
		this.albumServe.detailCategoryPageInfo(this.searchParams).subscribe(categoryInfo => {
			this.categoryInfo = categoryInfo;
			this.cdr.markForCheck();
		})

	}
}
