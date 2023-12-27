import {Category} from "../../services/apis/types";
import {CategoryInfo} from "../../services/apis/album.service";
import {Action, createReducer, on} from "@ngrx/store";
import {setCategories, setCategory, setCategoryInfo, setSubCategory} from "./action";

export const CategoryFeatureKey = 'category';

export interface CategoryState {
	category: string;
	subCategory: string[];
	categories: Category[];
	categoryInfo: CategoryInfo;
}

export const initialState: CategoryState = {
	category: 'youshengshu',
	subCategory: [],
	categories: [],
	categoryInfo: null,
};

export const reducer = createReducer(
	initialState,
	on(setCategories, (state, {categories}) => ({...state, categories})),
	on(setCategoryInfo, (state, categoryInfo) => ({...state, categoryInfo})),
	on(setCategory, (state, {category}) => ({...state, category})),
	on(setSubCategory, (state, {category}) => ({...state, subCategory: category})),
);

export function categoryReducer(state: CategoryState, action: Action): CategoryState {
	return reducer(state, action);
}
