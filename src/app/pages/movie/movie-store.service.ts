import {Injectable} from '@angular/core';
import {ComponentStore} from "@ngrx/component-store";
import {HOT_IDS, MOVIES} from "./datas";
import {Observable, switchMap, tap} from "rxjs";
import {AlbumService} from "../../services/apis/album.service";
import {Album} from "../../services/apis/types";

export interface Movie {
	id: string;
	title: string;
}

export interface MovieState {
	movies: Movie[];
	hotIds: string[];
}

@Injectable()
export class MovieStore extends ComponentStore<MovieState> {
	readonly movies$ = this.select(state => state.movies);
	readonly hotIds$ = this.select(state => state.hotIds);
	readonly hotMovies$ = this.select(
		this.movies$,
		this.hotIds$,
		(movies, hotIds) => movies.filter(movie => hotIds.includes(movie.id)),
	);

	constructor(
		private albumServe: AlbumService,
	) {
		super({movies: [], hotIds: []});
	}

	// action
	readonly addMovie = this.updater((state, movie: Movie) => {
		return {
			...state,
			movies: state.movies.concat(movie),
		}
	});
	readonly addMovies = this.updater((state, movies: Movie[]) => {
		return {
			...state,
			movies: state.movies.concat(movies),
		}
	});
	readonly getApiMovies = this.effect((pageSize$: Observable<number>) => {
		return pageSize$.pipe(
			switchMap(pageSize => this.albumServe.albums({
				category: 'youshengshu',
				subcategory: '',
				sort: 0,
				page: 1,
				perPage: pageSize,
				meta: '',
			})),
			tap({
				next: ({albums}) => this.addMovies(albums.map((album: Album) => ({
					id: `${album.albumId}`,
					title: album.title
				}))),
				error: e => console.error(e),
			}),
		)
	});

	initMovie(): void {
		this.setState({
			movies: MOVIES,
			hotIds: HOT_IDS,
		})
	}

	resetMovie(): void {
		this.setState({
			movies: [],
			hotIds: [],
		})
	}
}
