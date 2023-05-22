import {NgModule} from '@angular/core';
import {StrTplOutLetDirective} from './str-tpl-out-let.directive';


@NgModule({
	declarations: [
		StrTplOutLetDirective,
	],
	exports:[
		StrTplOutLetDirective,
	]
})
export class DirectivesModule {
}
