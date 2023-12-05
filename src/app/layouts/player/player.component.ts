import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	EventEmitter,
	Input, OnChanges,
	OnInit,
	Output,
	SimpleChanges,
	ViewChild
} from '@angular/core';
import {AlbumInfo, Track} from "../../services/apis/types";
import {PlayerService} from "../../services/business/player.service";

@Component({
	selector: 'app-player',
	templateUrl: './player.component.html',
	styleUrls: ['./player.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerComponent implements OnInit, OnChanges {
	@Input() trackList: Track[];
	@Input() currentIndex: number;
	@Input() currentTrack: Track;
	@Input() album: AlbumInfo;
	@Input() playing: boolean;
	private canPlay: boolean = false;
	@ViewChild('audio', {static: true}) protected audioRef: ElementRef;
	private audioEl: HTMLAudioElement;
	showPanel: boolean = false;
	@Output() closePlayer = new EventEmitter<void>();

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

	ngOnChanges(changes: SimpleChanges): void {
		const {playing} = changes;
		if (playing && !playing.firstChange) {
			if (playing.currentValue) {
				this.audioEl = this.audioRef.nativeElement;
				this.audioEl.play();
			} else {
				this.audioEl.pause();
			}
		}
	}

	togglePanel(showPanel: boolean): void {
		this.showPanel = showPanel;
	}

	togglePlay(): void {
		if (this.currentTrack) {
			if (this.canPlay) {
				const playing = !this.playing;
				this.playerServe.setPlaying(playing);
				if (!this.audioEl) {
					this.audioEl = this.audioRef.nativeElement;
				}
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

	private updateIndex(index: number, canplay = false): void {
		this.playerServe.setCurrentIndex(index);
		this.canPlay = canplay;
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
		if (this.canPlay) {
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

	deleteTrack(deleteIndex: number): void {
		let newTrack = this.trackList.slice();
		let newIndex = this.currentIndex;
		let canPlay = true;
		if (newTrack.length <= 1) {
			newTrack = [];
			newIndex = -1;
		} else {
			if (deleteIndex < this.currentIndex) {
				newIndex--;
			} else if (deleteIndex > this.currentIndex) {
				// 	不处理当前播放的索引 直接刷新列表即可
			} else {
				if (this.playing) {
					if (this.trackList[deleteIndex + 1]) {
						// 	不处理当前播放的索引 后面的歌曲会顶上来
					} else {
						newIndex--;
						canPlay = false;
					}
				} else {
					newIndex = -1;
					canPlay = false;
				}
			}
			newTrack.splice(deleteIndex, 1);
		}
		this.canPlay = canPlay;
		this.playerServe.setTrackList(newTrack);
		this.updateIndex(newIndex, canPlay);
	}
}
