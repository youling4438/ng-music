import {createEntityAdapter, EntityState} from "@ngrx/entity";
import {Action, createReducer, on} from "@ngrx/store";
import {BookActions,} from "./action";

export const BookFeatureKey = 'book';

export interface Book {
	id: string;
	title: string;
	author: string;
	version: string;
}

export interface BookState extends EntityState<Book> {
	//指定主键 默认是id
	selectedBookId: string | null;
}

export const adapter = createEntityAdapter<Book>();

export const initialState: BookState = adapter.getInitialState({
	selectedBookId: null,
});

const reducer = createReducer(
	initialState,
	on(BookActions.addBook, (state, book) => adapter.addOne(book, state)),
	on(BookActions.updateBook, (state, book) => adapter.updateOne(book, state)),
	on(BookActions.deleteBook, (state, {id}) => adapter.removeOne(id, state)),
	on(BookActions.clearAllBook, (state) => adapter.removeAll(state)),
	on(BookActions.setSelectedBookId, (state, {id},) => ({...state, selectedBookId: id,})),
)

export function bookReducerFunc(state: BookState, action: Action): BookState {
	return reducer(state, action);
}

