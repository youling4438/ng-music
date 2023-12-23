import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {BookStoreModule} from "../../store/book";
import {select, Store} from "@ngrx/store";
import {selectAllBook, selectBook, selectBookFeature} from "../../store/book/selectors";
import {BookActions} from "../../store/book/action";
import {Book} from "../../store/book/reducer";
import {Observable} from "rxjs";

let count: number = 0;

@Component({
	selector: 'app-book',
	template: `
		<button appBtn appRipples (click)="addBook()">add a book</button> |
		<button appBtn appRipples (click)="updateBook()">update a book</button> |
		<button appBtn appRipples (click)="deleteBook()">delete a book</button> |
		<button appBtn appRipples (click)="removeAllBook()">remove all book</button> |
		<button appBtn appRipples (click)="selectBook('id_2')">select a book</button> |
		<button appBtn appRipples (click)="selectBook('id_3')">select a book2</button> |

		<ul>
			<li *ngFor="let book of book$ | async">{{ book.title }}</li>
		</ul>
		<p>
			当前选择书籍：
			{{(selectedBook$ | async)?.title}}
		</p>
	`,
	styles: ``,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookComponent implements OnInit {
	book$: Observable<Book[]>;
	selectedBook$: Observable<Book>;

	constructor(
		readonly store$: Store<BookStoreModule>,
	) {
	}

	ngOnInit(): void {
		const selectBookStore = this.store$.select(selectBookFeature);
		this.book$ = selectBookStore.pipe(select(selectAllBook));
		this.selectedBook$ = selectBookStore.pipe(select(selectBook));
	}

	addBook(): void {
		this.store$.dispatch(BookActions.addBook(generateBook()));
	}

	updateBook(): void {
		this.store$.dispatch(BookActions.updateBook({
			id: 'id_2',
			changes: {title: 'Rxjs实战_2'},
		}));
	}
	selectBook(id: string): void {
		this.store$.dispatch(BookActions.setSelectedBookId({id,}));
	}
	deleteBook(): void {
		this.store$.dispatch(BookActions.deleteBook({id: 'id_2'}));
	}
	removeAllBook(): void {
		this.store$.dispatch(BookActions.clearAllBook());
	}
}

function generateBook(): Book {
	count += 1;
	return {
		id: 'id_' + count,
		title: 'Angular实战_' + count,
		author: 'Thomas_' + count,
		version: 'v_' + count,
	};
}
