import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MovieStore} from "./movie-store.service";

@Component({
	selector: 'app-movie',
	template: `
		<div class="button">
			<button appBtn appRipples (click)="initMovies()">init Movies</button>
			|
			<button appBtn appRipples (click)="addMovie()">add Movie</button>
			|
			<button appBtn appRipples (click)="addMovies()">add Movies</button>
			|
			<button appBtn appRipples (click)="addApiMovies()">add Movies from api</button>
			|
			<button appBtn appRipples (click)="resetMovies()">reset Movies</button>
		</div>
		<h3>影片列表：</h3>
		<ul>
			<li *ngFor="let movie of movies$ | async ">{{ movie.title }}</li>
		</ul>
		<h4>热门影片：</h4>
		<ul>
			<li *ngFor="let movie of hotMovies$ | async ">{{ movie.title }}</li>
		</ul>
	`,
	styles: ``,
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [MovieStore,]
})
export class MovieComponent {
	readonly movies$ = this.movieStore.movies$;
	readonly hotMovies$ = this.movieStore.hotMovies$;
	constructor(readonly movieStore: MovieStore) {
	}

	initMovies(): void {
		this.movieStore.initMovie();
	}
	addMovie(): void {
		this.movieStore.addMovie({
			id: 'm5',
			title: '灌篮高手',
		});
	}
	addMovies(): void {
		this.movieStore.addMovies([
			{
				id: 'm7',
				title: '网球王子',
			},
			{
				id: 'm8',
				title: '足球小将',
			},
		]);
	}

	resetMovies() :void {
		this.movieStore.resetMovie();
	}

	addApiMovies() :void {
		this.movieStore.getApiMovies(5);
	}
}
