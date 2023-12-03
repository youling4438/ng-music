import {ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {AlbumInfo, Track} from "../../services/apis/types";
import {PlayerService} from "../../services/business/player.service";

@Component({
	selector: 'app-player',
	templateUrl: './player.component.html',
	styleUrls: ['./player.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerComponent implements OnInit {
	@Input() trackList: Track[];
	@Input() currentIndex: number;
	@Input() currentTrack: Track;
	@Input() album: AlbumInfo;
	@Input() playing: boolean;
	private canPlay: boolean = false;
	@ViewChild('audio', {static: true}) protected audioRef: ElementRef;
	private audioEl: HTMLAudioElement;
	hidePanel: boolean = true;

	constructor(
		private playerServe: PlayerService,
	) {
	}

	ngOnInit(): void {
		console.log('currentTrack : ', this.currentTrack);
	}

	canplay(): void {
		this.canPlay = true;
		this.play();
		this.playerServe.setPlaying(true);
	}

	ended(): void {
		// this.playerServe.setPlaying(false);
	}

	error(): void {
		// this.playerServe.setPlaying(false);
	}

	togglePanel(hidePanel: boolean): void {
		this.hidePanel = hidePanel;
	}

	togglePlay(): void {
		if (this.currentTrack) {
			if (this.canPlay) {
				const playing = !this.playing;
				this.playerServe.setPlaying(playing);
				if (playing) {
					this.audioEl.play();
				} else {
					this.audioEl.pause();
				}
			}
		} else {
			if (this.trackList.length) {
				this.updateIndex(0);
			}
		}
	}

	private play(): void {
		if (!this.audioEl) {
			this.audioEl = this.audioRef.nativeElement;
		}
		this.audioEl.play();
	}

	private updateIndex(index: number): void {
		this.playerServe.setCurrentIndex(index);
		this.canPlay = false;
	}

	trackByTracks(_index: number, track: Track): number {
		return track.trackId;
	}

	changeTrack(index: number): void {
		if (index !== this.currentIndex) {
			this.updateIndex(index);
		} else {
			this.loop();
		}
	}

	private loop(): void {
		if(this.canPlay) {
			this.audioEl.currentTime = 0;
			this.play();
		}
	}

	prev(index: number): void {
		if (this.trackList.length === 1) {
			this.loop();
		} else {
			this.updateIndex(index < 0 ? this.trackList.length - 1 : index);
		}
	}

	next(index: number): void {
		if (this.trackList.length === 1) {
			this.loop();
		} else {
			this.updateIndex(index > this.trackList.length - 1 ? 0 : index);
		}
	}
}
