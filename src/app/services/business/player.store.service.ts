import {Injectable} from '@angular/core';
import {AlbumInfo, Track,} from "../apis/types";
import {Observable} from "rxjs";
import {PlayerState} from "../../store/player/reducers";
import {PlayerStoreModule} from "../../store/player";
import {select, Store} from "@ngrx/store";
import {
	getAlbum,
	getAllTracks,
	getCurrentIndex,
	getCurrentTrack, getPlaying,
	selectPlayerFeature
} from "../../store/player/selectors";
import {
	addTrack, addTracks,
	clearAll, deleteTrack,
	requestAlbum, requestAudio,
	setAlbum,
	setCurrentIndex,
	setCurrentTrack,
	setPlaying,
	setTracks
} from "../../store/player/actions";
import {take} from "rxjs/operators";

@Injectable({
	providedIn: 'root'
})
export class PlayerStoreService {
	player$: Observable<PlayerState>;
	private currentIndex: number;

	constructor(readonly store$: Store<PlayerStoreModule>) {
		this.player$ = this.store$.select(selectPlayerFeature);
	}

	requestAlbum(albumId: string) {
		this.store$.dispatch(requestAlbum({albumId}));
	}

	setTracks(tracks: Track[]): void {
		this.store$.dispatch(setTracks({tracks}));
	}

	getTrackList(): Observable<Track[]> {
		return this.player$.pipe(select(getAllTracks));
	}

	setAlbum(album: AlbumInfo): void {
		this.store$.dispatch(setAlbum(album));
	}

	getAlbum(): Observable<AlbumInfo> {
		return this.player$.pipe(select(getAlbum));
	}

	setCurrentTrack(index: number): void {
		this.getTrackList().pipe(take(1)).subscribe(tracks => {
			const track = tracks[index];
			if (track) {
				if (track.src) {
					this.store$.dispatch(setCurrentTrack(track));
				} else {
					this.setPlaying(false);
					this.store$.dispatch(requestAudio(track));
				}
			} else {
				this.store$.dispatch(setCurrentTrack(null));
			}
		});
	}

	getCurrentTrack(): Observable<Track> {
		return this.player$.pipe(select(getCurrentTrack));
	}

	setCurrentIndex(index: number): void {
		this.currentIndex = index;
		this.store$.dispatch(setCurrentIndex({index}));
		this.setCurrentTrack(index);
	}

	getCurrentIndex(): Observable<number> {
		return this.player$.pipe(select(getCurrentIndex));
	}

	setPlaying(playing: boolean): void {
		this.store$.dispatch(setPlaying({playing}));
	}

	getPlaying(): Observable<boolean> {
		return this.player$.pipe(select(getPlaying));
	}

	playTrack(track: Track): void {
		this.getTrackList().pipe(take(1)).subscribe(trackList => {
			const targetIndex: number = trackList.findIndex(_track => _track.trackId === track.trackId);
			if (targetIndex > -1) {
				if (targetIndex === this.currentIndex) {
					this.setPlaying(true);
				} else {
					this.setCurrentIndex(targetIndex);
				}
			} else {
				this.addTrack(track);
				// 最后一个曲目的索引
				this.setPlaying(false);
				this.setCurrentIndex(trackList.length);
			}
		});
	}

	private addTrack(track: Track): void {
		this.store$.dispatch(addTrack(track));
	}

	deleteTrack(trackId: number): void {
		this.store$.dispatch(deleteTrack({trackId}));
	}
	playTracks(tracks: Track[], index: number = 0): void {
		this.addTracks(tracks);
		this.getTrackList().pipe(take(1)).subscribe(trackList => {
			const playIndex: number = trackList.findIndex(item => item.trackId === tracks[index].trackId);
			this.setPlaying(false);
			this.setCurrentIndex(playIndex);
		});
	}

	addTracks(tracks: Track[]): void {
		this.store$.dispatch(addTracks({tracks}));
	}

	clear(): void {
		this.store$.dispatch(clearAll());
	}
}
