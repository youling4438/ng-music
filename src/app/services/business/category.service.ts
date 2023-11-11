import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable,} from "rxjs";
import {WindowService} from "../tools/window.service";
import {storageKeys} from "../../share/config";

@Injectable({
	providedIn: 'root'
})

export class CategoryService {
	category$ = new BehaviorSubject<string>('youshengshu');
	subCategory$ = new BehaviorSubject<string[]>([]);

	constructor(
		private winServe: WindowService,
	) {
		const cacheCategory = this.winServe.getStorage(storageKeys.categoryPinyin);
		if (cacheCategory) {
			this.category$.next(cacheCategory);
		}
	}

	getCategory(): Observable<string> {
		return this.category$.asObservable();
	}

	setCategory(category: string): void {
		this.winServe.setStorage(storageKeys.categoryPinyin, category);
		this.category$.next(category);
	}

	getSubCategory(): Observable<string[]> {
		return this.subCategory$.asObservable();
	}

	setSubCategory(subCategory: string[]): void {
		this.subCategory$.next(subCategory);
	}
}
