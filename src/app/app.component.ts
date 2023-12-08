import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AlbumService} from "./services/apis/album.service";
import {AlbumInfo, Category, Track} from "./services/apis/types";
import {CategoryService} from "./services/business/category.service";
import {Router} from "@angular/router";
import {combineLatest,} from "rxjs";
import {WindowService} from "./services/tools/window.service";
import {storageKeys} from "./share/config";
import {UserService} from "./services/apis/user.service";
import {ContextService} from "./services/business/context.service";
import {MessageService} from "./share/components/message/message.service";
import {PlayerService} from "./services/business/player.service";
import {animate, style, transition, trigger} from "@angular/animations";

// import {MessageType} from "./share/components/message/types";

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations:[
		trigger('fadePlayer',[
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
	currentCategory: Category;
	categories: Category[] = [];
	categoryPinyin: string = '';
	subcategory: string[] = [];
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
		private albumServe: AlbumService,
		private cdr: ChangeDetectorRef,
		private categoryServe: CategoryService,
		private router: Router,
		private winServe: WindowService,
		private userServe: UserService,
		private contextServe: ContextService,
		private messageServe: MessageService,
		private playerServe: PlayerService,
	) {
	}

	ngOnInit() {
		if (this.winServe.getStorage(storageKeys.remember)) {
			this.userServe.userInfo().subscribe(({user, token,}) => {
				this.contextServe.setUser(user);
				this.winServe.setStorage(storageKeys.token, token);
			}, error => {
				console.error(error);
				this.userLogout();
			});
		}
		this.init();
		this.listenPlayer();
	}

	private init(): void {
		combineLatest([this.categoryServe.getCategory(), this.categoryServe.getSubCategory()])
			.subscribe(([category, subcategory]) => {
				if (category !== this.categoryPinyin) {
					this.categoryPinyin = category;
					if (this.categories.length) {
						this.setCurrentCategory();
					}
				}
				this.subcategory = subcategory;
			});
		this.getCategories();
	}

	logout(): void {
		this.userServe.logout().subscribe(() => {
			this.userLogout();
			this.messageServe.success('退出登录成功');
		});
	}

	private userLogout(): void {
		this.winServe.removeStorage(storageKeys.remember);
		this.winServe.removeStorage(storageKeys.token);
		this.contextServe.setUser(null);
	}

	private setCurrentCategory(): void {
		this.currentCategory = this.categories.find(item => item.pinyin === this.categoryPinyin);
	}

	private getCategories(): void {
		this.albumServe.categories().subscribe(categories => {
			this.categories = categories;
			this.setCurrentCategory();
			this.cdr.markForCheck();
		});
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

	closePlayer() : void {
		this.playerServe.clear();
		this.showPlayer = false;
	}
}
