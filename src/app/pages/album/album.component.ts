import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
	selector: 'app-album',
	templateUrl: './album.component.html',
	styleUrls: ['./album.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlbumComponent implements OnInit {
	albumId: string;

	constructor(
		private route: ActivatedRoute,
	) {
	}

	ngOnInit(): void {
		this.albumId = this.route.snapshot.paramMap.get('albumId');
	}

}
