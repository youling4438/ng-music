import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {forkJoin} from "rxjs";
import {AlbumService, AlbumTrackArgs} from "../../services/apis/album.service";
import {CategoryService} from "../../services/business/category.service";
import {AlbumInfo, Anchor, RelateAlbum, Track} from "../../services/apis/types";

@Component({
	selector: 'app-album',
	templateUrl: './album.component.html',
	styleUrls: ['./album.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlbumComponent implements OnInit, AfterViewInit {
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

	constructor(
		private albumServe: AlbumService,
		private route: ActivatedRoute,
		private cdr: ChangeDetectorRef,
		private categoryServe: CategoryService,
	) {
	}

	ngOnInit(): void {
		this.trackParams.albumId = this.route.snapshot.paramMap.get('albumId');
	}

	ngAfterViewInit(): void {
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
