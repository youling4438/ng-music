import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	EventEmitter, Inject,
	Input, OnChanges,
	OnInit,
	Output, Renderer2,
	SimpleChanges,
	ViewChild
} from '@angular/core';
import {AlbumInfo, Track} from "../../services/apis/types";
import {PlayerService} from "../../services/business/player.service";
import {animate, style, transition, trigger} from "@angular/animations";
import {DOCUMENT} from "@angular/common";

const PANEL_HEIGHT = 280;
const THUMBNAIL_WIDTH = 50;

@Component({
	selector: 'app-player',
	templateUrl: './player.component.html',
	styleUrls: ['./player.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('playerPanel', [
			transition(':enter', [
				style({
					opacity: 0,
					height: 0,
				}),
				animate('.3s', style({
					opacity: 1,
					height: '*',
				})),
			]),
			transition(':leave', [
				style({
					overflow: 'hidden',
				}),
				animate('.3s', style({
					opacity: 0,
					height: 0,
				})),
			])
		])
	],
})
export class PlayerComponent implements OnInit, OnChanges {
	@Input() trackList: Track[];
	@Input() currentIndex: number;
	@Input() currentTrack: Track;
	@Input() album: AlbumInfo;
	@Input() playing: boolean;
	private canPlay: boolean = false;
	@ViewChild('audio', {static: true}) readonly audioRef: ElementRef;
	@ViewChild('player', {static: true}) readonly playerRef: ElementRef;
	private audioEl: HTMLAudioElement;
	showPanel: boolean = false;
	@Output() closePlayer = new EventEmitter<void>();
	isDown: boolean = true;
	private sidePlayer: boolean = false;
	private playerEl: HTMLElement;

	constructor(
		private playerServe: PlayerService,
		private rd2: Renderer2,
		@Inject(DOCUMENT) private doc: Document,
	) {
	}

	ngOnInit(): void {
	}

	canplay(): void {
		this.canPlay = true;
		this.play();
		this.playerServe.setPlaying(true);
	}

	ended(): void {
		this.playerServe.setPlaying(false);
		this.next(this.currentIndex + 1);
	}

	error(): void {
		this.playerServe.setPlaying(false);
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
		if (showPanel) {
			const {top} = this.playerRef.nativeElement.getBoundingClientRect();
			this.isDown = top < PANEL_HEIGHT + 10;
			this.showPanel = true;
		} else {
			this.showPanel = false;
		}
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

	dragEnd(dragItem: HTMLElement): void {
		if (dragItem) {
			this.playerEl = dragItem;
			const {top, left, width, height,} = dragItem.getBoundingClientRect();
			const maxTop: number = this.doc.documentElement.clientHeight - height;
			const maxLeft: number = this.doc.documentElement.clientWidth - width;
			this.rd2.setStyle(dragItem, 'transition', 'all 0.3s');
			if (top < 0) {
				this.rd2.setStyle(dragItem, 'top', '0');
			}
			if (top > maxTop) {
				this.rd2.setStyle(dragItem, 'top', maxTop + 'px');
			}
			if (left < 0) {
				this.rd2.setStyle(dragItem, 'left', '0');
			}
			if (left > maxLeft) {
				if (left > (maxLeft + width / 2)) {
					this.rd2.setStyle(dragItem, 'left', this.doc.documentElement.clientWidth - THUMBNAIL_WIDTH + 'px');
					this.sidePlayer = true;
					this.togglePanel(false);
				}
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

	hoverPlayer(): void {
		if (this.sidePlayer) {
			this.rd2.setStyle(this.playerEl, 'left', this.doc.documentElement.clientWidth - this.playerEl.getBoundingClientRect().width + 'px');
			this.sidePlayer = false;
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
