import {createActionGroup, emptyProps, props} from "@ngrx/store";
import {Book,} from "./reducer";
import {Update} from "@ngrx/entity";

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


