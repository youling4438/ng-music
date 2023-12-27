import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {AlbumService, CategoryInfo} from "../../services/apis/album.service";
import {categoriesInit, categoryInfoInit, setCategories, setCategoryInfo} from "./action";
import {mergeMap, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {Category} from "../../services/apis/types";

@Injectable()
export class CategoryEffects{
	constructor(
		private action$: Actions,
		private albumServe: AlbumService,
	) {
	}

	initCategory$ = createEffect(() => this.action$.pipe(
		ofType(categoriesInit),
		mergeMap(() => this.albumServe.categories()
			.pipe(
				map((categories: Category[]) => setCategories({categories})),
				catchError(error => throwError(error)),
			)
		)
	));

	initCategoryInfo$ = createEffect(() => this.action$.pipe(
		ofType(categoryInfoInit),
		mergeMap(payload => this.albumServe.detailCategoryPageInfo(payload)
			.pipe(
				map((categoryInfo: CategoryInfo) => setCategoryInfo(categoryInfo)),
				catchError(error => throwError(error)),
			)
		)
	));

}
