import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {AlbumInfo, Track} from "../../services/apis/types";

@Component({
	selector: 'app-player',
	templateUrl: './player.component.html',
	styleUrls: ['./player.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerComponent {
	@Input() trackList: Track[];
	@Input() currentIndex: number;
	@Input() currentTrack: Track;
	@Input() album: AlbumInfo;
	@Input() playing: boolean;
}
