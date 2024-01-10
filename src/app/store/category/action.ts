import {createAction, props} from "@ngrx/store";
import {Category} from "../../services/apis/types";
import {AlbumArgs, CategoryInfo} from "../../services/apis/album.service";


export const categoriesInit = createAction('[Category] categories init');
export const categoryInfoInit = createAction(
	'[Category] categoryInfo init',
	props<AlbumArgs>()
);
export const categoryEffectInit = createAction('[Category] category effect init');

export const setCategories = createAction(
	'[Category] set categories',
	props<{ categories: Category[] }>()
);

export const setCategoryInfo = createAction(
	'[Category] set categoryInfo',
	props<CategoryInfo>()
);
export const setCategory = createAction(
	'[Category] set category',
	props<{ category: string }>()
);
export const setSubCategory = createAction(
	'[Category] set subCategory',
	props<{ category: string[] }>()
);
