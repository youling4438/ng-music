import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	OnDestroy,
	OnInit,
} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {combineLatest, Observable, Subject, takeUntil} from "rxjs";
import {AlbumService, AlbumTrackArgs} from "../../services/apis/album.service";
import {AlbumInfo, Anchor, RelateAlbum, Track} from "../../services/apis/types";
import {MessageService} from "../../share/components/message/message.service";
import {PageInfoService} from "../../services/tools/page-info.service";
import {CategoryStoreService} from "../../services/business/category.store.service";
import {AlbumStoreService} from "../../services/business/album.store.service";
import {skip, take} from "rxjs/operators";
import {PlayerStoreService} from "../../services/business/player.store.service";

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
	score$: Observable<number>;
	anchor: Anchor;
	relateAlbums$: Observable<RelateAlbum[]>;
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
		private albumStoreServe: AlbumStoreService,
		private route: ActivatedRoute,
		private cdr: ChangeDetectorRef,
		private categoryStoreServe: CategoryStoreService,
		private playerStoreServe: PlayerStoreService,
		private messageServe: MessageService,
		private pageInfoServe: PageInfoService,
	) {
	}


	togglePlay(track: Track, action: 'play' | 'pause'): void {
		if (action === 'pause') {
			this.playerStoreServe.setPlaying(false);
		} else {
			this.setAlbumInfo();
			this.playerStoreServe.playTrack(track);
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
			this.trackParams.pageNum = 1;
			if (this.moreStatus.full) {
				this.toggleMoreStatus();
			}
			this.initAlbum();
			this.listenPlayer();
			this.updateTracks();
			this.listenTracksInfo();
		});
	}

	private listenTracksInfo() : void {
		this.albumStoreServe.getTracksInfo().pipe(skip(1),takeUntil(this.destroy$)).subscribe(tracksInfo => {
			this.tracks = tracksInfo.tracks;
			this.total = tracksInfo.trackTotalCount;
			this.cdr.markForCheck();
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
			this.playerStoreServe.getCurrentTrack(),
			this.playerStoreServe.getPlaying(),
		).pipe(takeUntil(this.destroy$)).subscribe(([track, playing]) => {
			this.currentTrack = track;
			this.playing = playing;
			this.cdr.markForCheck();
		});
	}

	initAlbum(): void {
		this.albumStoreServe.requestAlbum(this.trackParams.albumId);
		this.albumStoreServe.getAlbumInfo().pipe(skip(1), take(1)).subscribe(albumInfo => {
			this.albumInfo = albumInfo;
			console.log('albumInfo : ', albumInfo);
			this.anchor = albumInfo.anchorInfo;
			// this.categoryStoreServe.getCategory().pipe(take(1)).subscribe(category => {
			// 	const {categoryPinyin} = this.albumInfo.crumbs;
			// 	if(category !== categoryPinyin){
			// 		this.categoryStoreServe.setCategory(categoryPinyin);
			// 	}
			// })
			this.categoryStoreServe.setSubCategory([this.albumInfo.albumTitle]);
			this.pageInfoServe.setPageInfo(
				this.albumInfo.albumTitle,
				'Angular仿喜马拉雅专辑详情页面',
				'Angular10 喜马拉雅 有声书 小说 音乐 评书',
			);
			this.cdr.markForCheck();
		});
		this.score$ = this.albumStoreServe.getScore();
		this.relateAlbums$ = this.albumStoreServe.getRelateAlbum();
	}

	play(needPlay: boolean): void {
		if (this.checkedList.length) {
			if (needPlay) {
				this.playerStoreServe.playTracks(this.checkedList);
			} else {
				this.playerStoreServe.addTracks(this.checkedList);
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
			this.playerStoreServe.setAlbum(this.albumInfo);
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
		this.albumStoreServe.requestTracksInfo(this.trackParams);
	}

	trackByTracks(_index: number, track: Track): number {
		return track.trackId;
	}

	playAll(): void {
		this.playerStoreServe.setTracks(this.tracks);
		this.setAlbumInfo();
		this.playerStoreServe.setPlaying(false);
		this.playerStoreServe.setCurrentIndex(0);
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

}
