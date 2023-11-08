import {Directive, HostBinding, Input} from '@angular/core';

@Directive({
	selector: 'a[appBtn], button[appBtn]',
	host: {
		'[class.app-btn]': 'true',
	}
})
export class BtnDirective {
	@Input() @HostBinding('class.app-btn-block') btnBlock = false;
	@Input() @HostBinding('class.app-btn-circle') btnCircle = false;
	constructor() {
	}

}
