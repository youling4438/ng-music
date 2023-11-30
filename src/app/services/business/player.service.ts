import {Injectable} from '@angular/core';
import {AlbumInfo, Track} from "../apis/types";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
	providedIn: 'root'
})
export class PlayerService {
	trackList: Track[] = [];
	trackList$ = new BehaviorSubject<Track[]>([]);
	currentIndex: number = 0;
	currentIndex$ = new BehaviorSubject<number>(0);
	currentTrack$ = new BehaviorSubject<Track>(null);
	playing: boolean = false;
	playing$ = new BehaviorSubject<boolean>(false);
	album$ = new BehaviorSubject<AlbumInfo>(null);

	constructor() {
	}

	setTrackList(trackList: Track[]): void {
		this.trackList = trackList;
		this.trackList$.next(trackList);
	}

	getTrackList(): Observable<Track[]> {
		return this.trackList$.asObservable();
	}

	setAlbum(album: AlbumInfo): void {
		this.album$.next(album);
	}

	getAlbum(): Observable<AlbumInfo> {
		return this.album$.asObservable();
	}

	setCurrentTrack(track: Track): void {
		if (track) {
			this.currentTrack$.next(track);
		}
	}

	getCurrentTrack(): Observable<Track> {
		return this.currentTrack$.asObservable();
	}

	setCurrentIndex(index: number): void {
		this.currentIndex = index;
		this.currentIndex$.next(index);
		this.setCurrentTrack(this.trackList[index]);
	}

	getCurrentIndex(): Observable<number> {
		return this.currentIndex$.asObservable();
	}

	setPlaying(playing: boolean): void {
		this.playing = playing;
		this.playing$.next(playing);
	}

	getPlaying(): Observable<boolean> {
		return this.playing$.asObservable();
	}
}
