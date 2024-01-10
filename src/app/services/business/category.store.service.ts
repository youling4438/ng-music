import {Injectable} from '@angular/core';
import {Observable,} from "rxjs";
import {WindowService} from "../tools/window.service";
import {storageKeys} from "../../share/config";
import {CategoryState} from "../../store/category/reducer";
import {CategoryStoreModule} from "../../store/category";
import {select, Store} from "@ngrx/store";
import {categoriesInit, categoryInfoInit, setCategory, setSubCategory} from "../../store/category/action";
import {AlbumArgs, CategoryInfo} from "../apis/album.service";
import {
	getCategories,
	getCategory,
	getCategoryInfo,
	getCurrentCategory,
	getSubCategory,
	selectCategoryFeature
} from "../../store/category/selector";
import {Category} from "../apis/types";

@Injectable({
	providedIn: 'root'
})

export class CategoryStoreService {
	readonly category$: Observable<CategoryState>;

	constructor(
		private winServe: WindowService,
		readonly store$: Store<CategoryStoreModule>,
	) {
		this.category$ = this.store$.select(selectCategoryFeature);
		const cacheCategory = this.winServe.getStorage(storageKeys.categoryPinyin);
		if (cacheCategory) {
			this.setCategory(cacheCategory);
		}
	}

	initCategories(): void {
		this.store$.dispatch(categoriesInit());
	}

	initCategory(args: AlbumArgs): void {
		this.store$.dispatch(categoryInfoInit(args));
	}

	getCategories(): Observable<Category[]> {
		return this.category$.pipe(select(getCategories));
	}

	getCategory(): Observable<string> {
		return this.category$.pipe(select(getCategory));
	}

	getCurrentCategory(): Observable<Category> {
		return this.category$.pipe(select(getCurrentCategory));
	}

	getCategoryInfo(): Observable<CategoryInfo> {
		return this.category$.pipe(select(getCategoryInfo));
	}

	setCategory(category: string): void {
		this.winServe.setStorage(storageKeys.categoryPinyin, category);
		this.store$.dispatch(setCategory({category}));
	}

	getSubCategory(): Observable<string[]> {
		return this.category$.pipe(select(getSubCategory));
	}

	setSubCategory(subCategory: string[]): void {
		this.store$.dispatch(setSubCategory({category: subCategory}));
	}
}
