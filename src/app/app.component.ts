import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AlbumService} from "./services/apis/album.service";
import {Category} from "./services/apis/types";
import {CategoryService} from "./services/business/category.service";
import {Router} from "@angular/router";
import {combineLatest,} from "rxjs";
import {WindowService} from "./services/tools/window.service";
import {storageKeys} from "./share/config";
import {UserService} from "./services/apis/user.service";
import {ContextService} from "./services/business/context.service";
import {MessageService} from "./share/components/message/message.service";

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
	title = 'ng-music';
	currentCategory: Category;
	categories: Category[] = [];
	categoryPinyin: string = '';
	subcategory: string[] = [];
	showDialog: boolean = false;

	constructor(
		private albumServe: AlbumService,
		private cdr: ChangeDetectorRef,
		private categoryServe: CategoryService,
		private router: Router,
		private winServe: WindowService,
		private userServe: UserService,
		private contextServe: ContextService,
		private messageServe: MessageService,
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

	showMessage(): void {
		const messageData = this.messageServe.create('app component content', {
			pauseOnHover: true,
		});
		messageData.onClose.subscribe(() => {
			console.log('我被删除了 : ', messageData.messageId);
		});
	}
}
