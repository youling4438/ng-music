import {createActionGroup, emptyProps, props} from "@ngrx/store";
import {Book,} from "./reducer";
import {Update} from "@ngrx/entity";

// export const addBook = createAction('[Book] Add a book', props<Book>);
// export const updateBook = createAction('[Book] Update a book', props<Update<Book>>);
// export const deleteBook = createAction('[Book] Delete a book', props<{ id: string }>);
// export const clearAllBook = createAction('[Book] Clear all book');
// export const setSelectedBook = createAction('[Book] Select a book', props<{ id: string }>);

export const BookActions = createActionGroup({
	source: 'Book',
	events: {
		addBook: props<Book>(),
		updateBook: props<Update<Book>>(),
		deleteBook: props<{ id: string }>(),
		clearAllBook: emptyProps(),
		setSelectedBookId: props<{ id: string }>(),
	},
});


