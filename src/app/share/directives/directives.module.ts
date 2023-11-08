import {NgModule} from '@angular/core';
import {StrTplOutLetDirective} from './str-tpl-out-let.directive';
import {IconDirective} from './icon/icon.directive';
import {BtnDirective} from "./btn.directive";


@NgModule({
	declarations: [
		StrTplOutLetDirective,
		IconDirective,
		BtnDirective,
	],
	exports: [
		StrTplOutLetDirective,
		IconDirective,
		BtnDirective,
	]
})
export class DirectivesModule {
}
