import {adapter, Book, BookFeatureKey, BookState} from "./reducer";
import {createFeatureSelector, createSelector} from "@ngrx/store";
import {EntityState} from "@ngrx/entity";

export const selectBookFeature = createFeatureSelector<BookState>(BookFeatureKey);

// get the selectors
const {
	selectIds,
	selectEntities,
	selectAll,
	selectTotal,
} = adapter.getSelectors();

export const selectBookState = (state: EntityState<Book>) => state;
export const selectBookIds = createSelector(selectBookState, selectIds);
export const selectBookEntities = createSelector(selectBookState, selectEntities);
export const selectAllBook = createSelector(selectBookState, selectAll);
export const selectBookTotal = createSelector(selectBookState, selectTotal);
export const selectedBookId = createSelector(
	selectBookState,
	(state: BookState) => state.selectedBookId,
)

export const selectBook = createSelector(
	selectBookEntities,
	selectedBookId,
	(books, id) => books[id],
)
