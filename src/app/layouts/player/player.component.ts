import {
	ChangeDetectionStrategy, ChangeDetectorRef,
	Component,
	ElementRef,
	EventEmitter, Inject,
	Input, OnDestroy,
	OnInit,
	Output, Renderer2,
	ViewChild
} from '@angular/core';
import {AlbumInfo, Track} from "../../services/apis/types";
import {animate, style, transition, trigger} from "@angular/animations";
import {DOCUMENT} from "@angular/common";
import {PlayerStoreService} from "../../services/business/player.store.service";
import {Observable, Subscription} from "rxjs";
import {take} from "rxjs/operators";

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
export class PlayerComponent implements OnInit, OnDestroy {
	@Input() trackList: Track[];
	currentIndex: number;
	currentTrack$: Observable<Track>;
	album$: Observable<AlbumInfo>;
	playing: boolean;
	private canPlay: boolean = false;
	@ViewChild('audio', {static: true}) readonly audioRef: ElementRef;
	@ViewChild('player', {static: true}) readonly playerRef: ElementRef;
	private audioEl: HTMLAudioElement;
	showPanel: boolean = false;
	@Output() closePlayer = new EventEmitter<void>();
	isDown: boolean = true;
	private sidePlayer: boolean = false;
	private playerEl: HTMLElement;
	private subscription: Subscription;

	constructor(
		private rd2: Renderer2,
		private playerStoreServe: PlayerStoreService,
		private cdr: ChangeDetectorRef,
		@Inject(DOCUMENT) private doc: Document,
	) {
	}


	ngOnInit(): void {
		this.currentTrack$ = this.playerStoreServe.getCurrentTrack();
		this.album$ = this.playerStoreServe.getAlbum();
		this.playerStoreServe.getCurrentIndex().subscribe(currentIndex => {
			this.currentIndex = currentIndex;
			this.cdr.markForCheck();
		});

		this.playerStoreServe.getPlaying().subscribe(playing => {
			this.setPlaying(playing);
			this.cdr.markForCheck();
		});
	}

	private setPlaying(playing: boolean): void {
		if (this.playing !== playing) {
			this.playing = playing;
			this.audioEl = this.audioRef.nativeElement;
			if (playing && this.canPlay) {
				this.audioEl.play();
			} else {
				this.audioEl.pause();
			}
		}
	}

	canplay(): void {
		this.canPlay = true;
		this.play();
	}

	ended(): void {
		this.playerStoreServe.setPlaying(false);
		this.next(this.currentIndex + 1);
	}

	error(): void {
		this.playerStoreServe.setPlaying(false);
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
		this.currentTrack$.pipe(take(1)).subscribe(currentTrack => {
			if (currentTrack) {
				if (this.canPlay) {
					this.playerStoreServe.setPlaying(!this.playing);
				}
			} else {
				if (this.trackList.length) {
					// this.playerStoreServe.setPlaying(false);
					this.updateIndex(0);
				}
			}
		})
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
		this.playerStoreServe.setPlaying(true);
	}

	private updateIndex(index: number): void {
		if (index !== this.currentIndex) {
			this.playerStoreServe.setPlaying(false);
			this.playerStoreServe.setCurrentIndex(index);
			this.canPlay = false;
		}
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
		let delTarget: Track;
		if (newTrack.length <= 1) {
			newIndex = -1;
			delTarget = newTrack[0];
			newTrack = [];
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
					}
				} else {
					newIndex = -1;
				}
			}
			delTarget = newTrack.splice(deleteIndex, 1)[0];
		}
		this.playerStoreServe.setTracks(newTrack);
		this.playerStoreServe.deleteTrack(delTarget?.trackId);
		this.updateIndex(newIndex);
	}

	ngOnDestroy(): void {
		this.subscription?.unsubscribe();
	}

}
