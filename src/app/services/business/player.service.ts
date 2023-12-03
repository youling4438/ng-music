import {Injectable} from '@angular/core';
import {AlbumInfo, Track, TrackAudio} from "../apis/types";
import {BehaviorSubject, Observable} from "rxjs";
import {AlbumService} from "../apis/album.service";
import {MessageService} from "../../share/components/message/message.service";

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

	constructor(
		private albumServe: AlbumService,
		private messageServe: MessageService,
	) {
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
			const target: Track = this.trackList.find(item => item.trackId === track.trackId);
			if (target) {
				if (target.src) {
					this.currentTrack$.next(track);
				} else {
					this.getAudio(track);
				}
			} else {
				this.getAudio(track);
			}
		} else {
			this.currentTrack$.next(null);
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

	private getAudio(track: Track): void {
		this.albumServe.trackAudio(track.trackId).subscribe((audio: TrackAudio) => {
			if (!audio.src && audio.isPaid) {
				this.messageServe.warning('请先购买专辑');
			} else {
				track.src = audio.src;
				track.isPaid = audio.isPaid;
				this.currentTrack$.next(track);
			}
		});
	}

	clear(): void {
		this.setAlbum(null);
		this.setTrackList([]);
		this.setCurrentIndex(-1);
		this.setCurrentTrack(null);
		this.setPlaying(false);
	}
}
