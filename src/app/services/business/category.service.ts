import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
	providedIn: 'root'
})

export class CategoryService {
	category$ = new BehaviorSubject<string>('youshengshu');
	subCategory$ = new BehaviorSubject<string[]>([]);
	constructor() {
	}

	getCategory(): Observable<string>{
		return this.category$.asObservable();
	}

	setCategory(category: string): void{
		this.category$.next(category);
	}

	getSubCategory(): Observable<string[]>{
		return this.subCategory$.asObservable();
	}

	setSubCategory(subCategory: string[]): void{
		this.subCategory$.next(subCategory);
	}
}
