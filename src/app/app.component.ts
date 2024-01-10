import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AlbumInfo, Category, Track} from "./services/apis/types";
import {Router} from "@angular/router";
import {combineLatest, Observable,} from "rxjs";
import {WindowService} from "./services/tools/window.service";
import {storageKeys} from "./share/config";
import {MessageService} from "./share/components/message/message.service";
import {PlayerService} from "./services/business/player.service";
import {animate, style, transition, trigger} from "@angular/animations";
import {ContextStoreService} from "./services/business/context.store.service";
import {RouterStoreModule} from "./store/router";
import {Store} from "@ngrx/store";
import {selectCustomRouter, selectUrl, selectRouteParams,} from "./store/router/custom.reducer";
import {CategoryStoreService} from "./services/business/category.store.service";

// import {MessageType} from "./share/components/message/types";

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('fadePlayer', [
			transition(':enter', [
				style({opacity: 0}),
				animate('.3s', style({
					opacity: 1,
				}))
			]),
			transition(':leave', [
				animate('.3s', style({
					opacity: 0,
				}))
			]),
		])
	],
})
export class AppComponent implements OnInit {
	title = 'ng-music';
	currentCategory$: Observable<Category>;
	categories$: Observable<Category[]>;
	categoryPinyin: string = '';
	subCategory$: Observable<string[]>
	showDialog: boolean = false;
	showPlayer: boolean = false;
	playerInfo: {
		trackList: Track[];
		currentTrack: Track;
		album: AlbumInfo;
		currentIndex: number;
		playing: boolean;
	};

	constructor(
		private cdr: ChangeDetectorRef,
		private router: Router,
		private winServe: WindowService,
		private contextStoreServe: ContextStoreService,
		private messageServe: MessageService,
		private playerServe: PlayerService,
		readonly routerStore$: Store<RouterStoreModule>,
		readonly categoryStoreServe: CategoryStoreService,
	) {
		this.routerStore$.select(selectCustomRouter).subscribe(routerState => {
			console.log('selectRouter : ', routerState);
		});
		this.routerStore$.select(selectUrl).subscribe(url => {
			console.log('selectUrl : ', url);
		});
		this.routerStore$.select(selectRouteParams).subscribe(params => {
			console.log('selectRouteParams : ', params);
		});
		this.categories$ = this.categoryStoreServe.getCategories();
		this.currentCategory$ = this.categoryStoreServe.getCurrentCategory();
		this.subCategory$ = this.categoryStoreServe.getSubCategory();
	}

	ngOnInit() {
		if (this.winServe.getStorage(storageKeys.remember)) {
			this.contextStoreServe.userInfo();
		}
		this.init();
		this.listenPlayer();
	}
	private init(): void {
		this.categoryStoreServe.initCategories();
		this.categoryStoreServe.getCategories();
		combineLatest([this.categoryStoreServe.getCategory(), this.categoryStoreServe.getSubCategory()])
			.subscribe(([category, subcategory]) => {
				if (category !== this.categoryPinyin) {
					this.categoryPinyin = category;
				}
			});
	}

	logout(): void {
		this.contextStoreServe.logout();
	}


	changeCategory(category: Category): void {
		this.router.navigateByUrl('/albums/' + category.pinyin);
	}

	// showMessage(type: MessageType = 'info'): void {
	// 	const messageData = this.messageServe[type]('app component content', {
	// 		duration: 2500,
	// 		pauseOnHover: true,
	// 		maxStack: 5,
	// 		type: 'error',
	// 	});
	// 	messageData.onClose.subscribe(() => {
	// 		console.log('我被删除了 : ', messageData.messageId);
	// 	});
	// }

	private listenPlayer(): void {
		combineLatest(
			this.playerServe.getTrackList(),
			this.playerServe.getAlbum(),
			this.playerServe.getCurrentTrack(),
			this.playerServe.getCurrentIndex(),
			this.playerServe.getPlaying(),
		).subscribe(([trackList, album, currentTrack, currentIndex, playing]) => {
			this.playerInfo = {
				trackList,
				album,
				currentTrack,
				currentIndex,
				playing,
			};
			if (trackList.length) {
				this.showPlayer = true;
				this.cdr.markForCheck();
			}
		});
	}

	closePlayer(): void {
		this.playerServe.clear();
		this.showPlayer = false;
	}
}
