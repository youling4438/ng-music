import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {BookStoreModule} from "../../store/book";
import {select, Store} from "@ngrx/store";
import {selectAllBook, selectBookFeature} from "../../store/book/selectors";
import {BookActions} from "../../store/book/action";
import {Book} from "../../store/book/reducer";
import {Observable} from "rxjs";

let count: number = 0;

@Component({
	selector: 'app-book',
	template: `
		<button appBtn appRipples (click)="addBook()">add a book</button> |
		<button appBtn appRipples>update a book</button> |
		<button appBtn appRipples>delete a book</button> |
		<button appBtn appRipples>remove all book</button> |
		<button appBtn appRipples>select a book</button> |
		<button appBtn appRipples>select a book2</button> |

		<ul>
			<li *ngFor="let book of book$ | async">{{book.title}}</li>
		</ul>
	`,
	styles: ``,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookComponent implements OnInit {
	book$: Observable<Book[]>;
	constructor(
		readonly store$: Store<BookStoreModule>,
	) {
	}

	ngOnInit(): void {
		const selectBookStore = this.store$.select(selectBookFeature);
		this.book$ = selectBookStore.pipe(select(selectAllBook));
	}

	addBook(): void {
		this.store$.dispatch(BookActions.addBook(generateBook()));
	}
}

function generateBook(): Book {
	count += 1;
	return {
		id: 'id_' + count,
		title: 'Angular实战' + count,
		author: 'Thomas_' + count,
		version: 'v_' + count,
	};
}
