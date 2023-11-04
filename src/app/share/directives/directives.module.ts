import {NgModule} from '@angular/core';
import {StrTplOutLetDirective} from './str-tpl-out-let.directive';
import {IconDirective} from './icon/icon.directive';


@NgModule({
	declarations: [
		StrTplOutLetDirective,
		IconDirective,
	],
	exports: [
		StrTplOutLetDirective,
		IconDirective,
	]
})
export class DirectivesModule {
}
