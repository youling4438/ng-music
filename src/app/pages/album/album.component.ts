import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {forkJoin} from "rxjs";
import {AlbumService, AlbumTrackArgs} from "../../services/apis/album.service";
import {CategoryService} from "../../services/business/category.service";
import {AlbumInfo, Anchor, RelateAlbum, Track} from "../../services/apis/types";

interface MoreStatus {
	full: boolean;
	label: '显示全部' | '收起';
	icon: 'arrow-down-line' | 'arrow-up-line';
}

@Component({
	selector: 'app-album',
	templateUrl: './album.component.html',
	styleUrls: ['./album.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlbumComponent implements OnInit {
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

	constructor(
		private albumServe: AlbumService,
		private route: ActivatedRoute,
		private cdr: ChangeDetectorRef,
		private categoryServe: CategoryService,
	) {
	}

	toggleMoreStatus(): void {
		this.moreStatus.full = !this.moreStatus.full;
		this.moreStatus.label = this.moreStatus.full ? '收起' : '显示全部';
		this.moreStatus.icon = this.moreStatus.full ? 'arrow-up-line' : 'arrow-down-line';
	}

	ngOnInit(): void {
		this.route.paramMap.subscribe(paramMap => {
			this.trackParams.albumId = paramMap.get('albumId');
			if (this.moreStatus.full) {
				this.toggleMoreStatus();
			}
			this.initAlbum();
		});
	}

	initAlbum(): void {
		forkJoin([
			this.albumServe.albumScore(this.trackParams.albumId),
			this.albumServe.album(this.trackParams.albumId),
			this.albumServe.relateAlbums(this.trackParams.albumId),
		]).subscribe(([score, albumInfo, relateAlbums]) => {
			this.score = score;
			this.albumInfo = {...albumInfo.mainInfo, albumId: albumInfo.albumId,};
			this.anchor = albumInfo.anchorInfo;
			this.tracks = albumInfo.tracksInfo.tracks;
			this.total = albumInfo.tracksInfo.trackTotalCount;
			this.relateAlbums = relateAlbums.slice(0, 10);
			this.categoryServe.setSubCategory([this.albumInfo.albumTitle]);
			this.cdr.markForCheck();
		});
	}
}
