import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AlbumService} from "./services/apis/album.service";
import {Category} from "./services/apis/types";
import {CategoryService} from "./services/business/category.service";
import {Router} from "@angular/router";
import {combineLatest} from "rxjs";

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

	constructor(
		private albumServe: AlbumService,
		private cdr: ChangeDetectorRef,
		private categoryServe: CategoryService,
		private router: Router,
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
				this.categoryServe.setCategory(category);
			}
			if (this.categories.length) {
				this.setCurrentCategory();
			}
			this.subcategory = subcategory;
		});
		this.getCategories();
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
		if (this.currentCategory.id !== category.id) {
			this.router.navigateByUrl('/albums/' + category.pinyin);
		}
	}
}
