import {Injectable} from '@angular/core';
import {Observable,} from "rxjs";
import {select, Store} from "@ngrx/store";
import {AlbumState} from "../../store/album/reducers";
import {AlbumStoreModule} from "../../store/album";
import {
	getAlbumInfo,
	getAlbumsInfo,
	getRelateAlbums,
	getScore,
	getTracksInfo,
	selectAlbumFeature
} from "../../store/album/selectors";
import {requestAlbum, requestAlbumsInfo, requestTracksInfo} from "../../store/album/actions";
import {AlbumArgs, AlbumsInfo, AlbumTrackArgs} from "../apis/album.service";
import {AlbumInfo, RelateAlbum, TracksInfo} from "../apis/types";

@Injectable({
	providedIn: 'root'
})

export class AlbumStoreService {
	readonly album$: Observable<AlbumState>;

	constructor(
		readonly store$: Store<AlbumStoreModule>,
	) {
		this.album$ = this.store$.select(selectAlbumFeature);
	}

	requestAlbumsInfo(args: AlbumArgs): void {
		this.store$.dispatch(requestAlbumsInfo(args));
	}

	requestAlbum(albumId: string): void {
		this.store$.dispatch(requestAlbum({albumId}));
	}

	requestTracksInfo(args: AlbumTrackArgs): void {
		this.store$.dispatch(requestTracksInfo(args));
	}

	getAlbumInfo(): Observable<AlbumInfo> {
		return this.album$.pipe(select(getAlbumInfo));
	}
	getAlbumsInfo(): Observable<AlbumsInfo> {
		return this.album$.pipe(select(getAlbumsInfo));
	}

	getScore(): Observable<number> {
		return this.album$.pipe(select(getScore));
	}

	getRelateAlbum(): Observable<RelateAlbum[]> {
		return this.album$.pipe(select(getRelateAlbums));
	}

	getTracksInfo(): Observable<TracksInfo> {
		return this.album$.pipe(select(getTracksInfo));
	}
}
