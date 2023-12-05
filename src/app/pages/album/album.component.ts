import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {combineLatest, first, forkJoin, Subject, takeUntil} from "rxjs";
import {AlbumService, AlbumTrackArgs} from "../../services/apis/album.service";
import {CategoryService} from "../../services/business/category.service";
import {AlbumInfo, Anchor, RelateAlbum, Track, TracksInfo} from "../../services/apis/types";
import {PlayerService} from "../../services/business/player.service";
import {MessageService} from "../../share/components/message/message.service";

interface MoreStatus {
	full: boolean;
	label: '显示全部' | '收起';
	icon: 'arrow-down-line' | 'arrow-up-line';
}

@Component({
	selector: 'app-album',
	templateUrl: './album.component.html',
	styleUrls: ['./album.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlbumComponent implements OnInit, OnDestroy {
	albumInfo: AlbumInfo;
	score: number;
	anchor: Anchor;
	relateAlbums: RelateAlbum[];
	tracks: Track[] = [];
	total = 0;
	trackParams: AlbumTrackArgs = {
		albumId: '',
		sort: 1,
		pageNum: 1,
		pageSize: 30
	};
	moreStatus: MoreStatus = {
		full: false,
		label: '显示全部',
		icon: 'arrow-down-line',
	};
	articleHeight: number;
	checkedList: Track[] = [];
	private currentTrack: Track;
	private playing: boolean;
	destroy$ = new Subject<void>();

	constructor(
		private albumServe: AlbumService,
		private route: ActivatedRoute,
		private cdr: ChangeDetectorRef,
		private categoryServe: CategoryService,
		private playerServe: PlayerService,
		private messageServe: MessageService,
	) {
	}


	togglePlay(track: Track, action: 'play' | 'pause'): void {
		if (action === 'pause') {
			this.playerServe.setPlaying(false);
		} else {
			this.setAlbumInfo();
			this.playerServe.playTrack(track);
		}
	}

	toggleMoreStatus(): void {
		this.moreStatus.full = !this.moreStatus.full;
		this.moreStatus.label = this.moreStatus.full ? '收起' : '显示全部';
		this.moreStatus.icon = this.moreStatus.full ? 'arrow-up-line' : 'arrow-down-line';
	}

	ngOnInit(): void {
		this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(paramMap => {
			this.trackParams.albumId = paramMap.get('albumId');
			if (this.moreStatus.full) {
				this.toggleMoreStatus();
			}
			this.initAlbum();
			this.listenPlayer();
		});

	}

	className(id: number): string {
		let result = 'item-name ';
		if (this.currentTrack) {
			if (this.playing) {
				if (id === this.currentTrack.trackId) {
					result += 'item-name-playing';
				}
			} else {
				if (id === this.currentTrack.trackId) {
					result += 'item-name-pause';
				}
			}
		}
		return result;
	}

	private listenPlayer(): void {
		combineLatest(
			this.playerServe.getCurrentTrack(),
			this.playerServe.getPlaying(),
		).pipe(takeUntil(this.destroy$)).subscribe(([track, playing]) => {
			this.currentTrack = track;
			this.playing = playing;
			this.cdr.markForCheck();
		});
	}

	initAlbum(): void {
		forkJoin([
			this.albumServe.albumScore(this.trackParams.albumId),
			this.albumServe.album(this.trackParams.albumId),
			this.albumServe.relateAlbums(this.trackParams.albumId),
		]).pipe(first()).subscribe(([score, albumInfo, relateAlbums]) => {
			this.score = score / 2;
			this.albumInfo = {...albumInfo.mainInfo, albumId: albumInfo.albumId,};
			this.anchor = albumInfo.anchorInfo;
			this.updateTracks();
			this.relateAlbums = relateAlbums.slice(0, 10);
			this.categoryServe.setSubCategory([this.albumInfo.albumTitle]);
			this.cdr.markForCheck();
		});
	}

	play(needPlay: boolean): void {
		if (this.checkedList.length) {
			if (needPlay) {
				this.playerServe.playTracks(this.checkedList);
			} else {
				this.playerServe.addTracks(this.checkedList);
				this.messageServe.info('已添加曲目');
			}
			this.setAlbumInfo();
			this.checkAllChange(false);
		} else {
			this.messageServe.warning('请先勾选曲目');
		}
	}

	private setAlbumInfo(): void {
		if (!this.currentTrack) {
			this.playerServe.setAlbum(this.albumInfo);
		}
	}

	changePage(newPage: number): void {
		if (newPage !== this.trackParams.pageNum) {
			this.trackParams.pageNum = newPage;
			this.updateTracks();
		}
	}

	isChecked(trackId: number): boolean {
		const targetIndex = this.getTrackIndex(trackId);
		return targetIndex > -1;
	}

	checkAllChange(checked: boolean): void {
		this.tracks.forEach(_track => {
			const targetIndex = this.getTrackIndex(_track.trackId);
			if (checked) {
				if (targetIndex === -1) {
					this.checkedList.push(_track);
				}
			} else {
				if (targetIndex > -1) {
					this.checkedList.splice(targetIndex, 1);
				}
			}
		});
	}

	isCheckedAll(): boolean {
		if (this.checkedList.length >= this.tracks.length) {
			return this.tracks.every(_track => this.getTrackIndex(_track.trackId) > -1);
		}
		return false;
	}

	private getTrackIndex(id: number): number {
		return this.checkedList.findIndex(track => track.trackId === id);
	}

	checkedChange(checked: boolean, _track: Track): void {
		const targetIndex = this.getTrackIndex(_track.trackId);
		if (checked) {
			if (targetIndex < 0) {
				this.checkedList.push(_track);
			}
		} else {
			if (targetIndex > -1) {
				this.checkedList.splice(targetIndex, 1);
			}
		}
	}

	private updateTracks(): void {
		this.albumServe.tracks(this.trackParams)
			.pipe(first())
			.subscribe((trackData: TracksInfo) => {
				this.total = trackData.trackTotalCount;
				this.tracks = trackData.tracks;
				this.cdr.markForCheck();
			});
	}

	trackByTracks(_index: number, track: Track): number {
		return track.trackId;
	}

	playAll(): void {
		this.playerServe.setTrackList(this.tracks);
		this.setAlbumInfo();
		this.playerServe.setCurrentIndex(0);
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

}
