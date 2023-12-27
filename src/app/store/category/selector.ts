import {createFeatureSelector, createSelector} from "@ngrx/store";
import {CategoryFeatureKey, CategoryState} from "./reducer";

export const selectCategoryFeature = createFeatureSelector<CategoryState>(CategoryFeatureKey);
export const selectCategoryState = (state: CategoryState) => state;
export const getCategories = createSelector(selectCategoryState, (state: CategoryState) => state.categories);
export const getCategoryInfo = createSelector(selectCategoryState, (state: CategoryState) => state.categoryInfo);
export const getSubCategory = createSelector(selectCategoryState, (state: CategoryState) => state.subCategory);
export const getCategory = createSelector(selectCategoryState, (state: CategoryState) => state.category);
export const getCurrentCategory = createSelector(
	getCategories,
	getCategory,
	(categories, categoryName) => categories.find(category => category.pinyin === categoryName)
);
