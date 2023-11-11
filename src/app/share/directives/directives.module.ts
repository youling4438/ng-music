import {NgModule} from '@angular/core';
import {StrTplOutLetDirective} from './str-tpl-out-let.directive';
import {IconDirective} from './icon/icon.directive';
import {BtnDirective} from "./btn.directive";
import {ToggleMoreDirective} from './toggle-more.directive';


@NgModule({
	declarations: [
		StrTplOutLetDirective,
		IconDirective,
		BtnDirective,
		ToggleMoreDirective,
	],
	exports: [
		StrTplOutLetDirective,
		IconDirective,
		BtnDirective,
		ToggleMoreDirective,
	]
})
export class DirectivesModule {
}
