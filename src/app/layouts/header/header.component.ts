import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {User} from "../../services/apis/types";

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
	user: User = {} as User;
	constructor() {
		console.log('xxxxx');
	}

	ngOnInit() {
	/*	this.user = {
			name: 'Thomas',
			password: 'mario',
			phone: '123456',
		};*/
	}
}
