import {Injectable} from '@angular/core';
import {Title, Meta} from "@angular/platform-browser";

@Injectable({
	providedIn: 'root'
})
export class PageInfoService {

	constructor(
		private title: Title,
		private meta: Meta,
	) {
	}

	setPageInfo(title: string, description: string, keywords: string): void {
		this.title.setTitle(title);
		this.meta.updateTag({content: description,}, 'name=description');
		this.meta.updateTag({content: keywords,}, 'name=keywords');
	}
}
