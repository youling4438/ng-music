import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";

type SafeContentType = 'html' | 'script' | 'url' | 'style' | 'resourceUrl';
const funcMap = {
	'html': 'bypassSecurityTrustHtml',
	'script': 'bypassSecurityTrustScript',
	'url': 'bypassSecurityTrustUrl',
	'style': 'bypassSecurityTrustStyle',
	'resourceUrl': 'bypassSecurityTrustResourceUrl',
}
@Pipe({
	name: 'safeContent'
})
export class SafeContentPipe implements PipeTransform {

	constructor(private domSanitizer: DomSanitizer) {
	}

	transform(value: string, type: SafeContentType = 'html') {
		return this.domSanitizer[funcMap[type]](value);
	}

}
