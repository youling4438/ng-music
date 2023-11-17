import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AlbumService} from "./services/apis/album.service";
import {Category} from "./services/apis/types";
import {CategoryService} from "./services/business/category.service";
import {Router} from "@angular/router";
import {combineLatest, empty, first, merge, of, pluck, switchMap,} from "rxjs";
import {OverlayConfig, OverlayRef, OverlayService} from "./services/tools/overlay.service";

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
	title = 'ng-music';
	currentCategory: Category;
	categories: Category[] = [];
	categoryPinyin: string = '';
	subcategory: string[] = [];
	private overlayRef: OverlayRef;

	constructor(
		private albumServe: AlbumService,
		private cdr: ChangeDetectorRef,
		private categoryServe: CategoryService,
		private router: Router,
		private overlayServe: OverlayService,
	) {
	}

	ngOnInit() {
		this.init();
	}

	private init(): void {
		combineLatest([this.categoryServe.getCategory(), this.categoryServe.getSubCategory()])
			.subscribe(([category, subcategory]) => {
				if (category !== this.categoryPinyin) {
					this.categoryPinyin = category;
					if (this.categories.length) {
						this.setCurrentCategory();
					}
				}
				this.subcategory = subcategory;
			});
		this.getCategories();
	}

	createOverlay(): void {
		const overlayConfig: OverlayConfig = {
			center: true,
		};
		this.overlayRef = this.overlayServe.create(overlayConfig);
		merge(
			this.overlayRef.backdropClick(),
			this.overlayRef.backdropKeyup()
				.pipe(
					pluck('key'),
					switchMap(key => {
						return key.toUpperCase() === 'ESCAPE' ? of(key) : empty();
					})
				)
		).pipe(first()).subscribe(() => {
			this.hideOverlay();
		});
	}

	private hideOverlay(): void {
		if (this.overlayRef) {
			this.overlayRef.close();
			this.overlayRef = null;
		}
	}

	private setCurrentCategory(): void {
		this.currentCategory = this.categories.find(item => item.pinyin === this.categoryPinyin);
	}

	private getCategories(): void {
		this.albumServe.categories().subscribe(categories => {
			this.categories = categories;
			this.setCurrentCategory();
			this.cdr.markForCheck();
		});
	}

	changeCategory(category: Category): void {
		this.router.navigateByUrl('/albums/' + category.pinyin);
	}
}
