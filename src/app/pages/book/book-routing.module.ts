import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BookComponent} from "./book.component";
import {DirectivesModule} from "../../share/directives/directives.module";

const routes: Routes = [
	{
		path: '', component: BookComponent,
	}
];

@NgModule({
	imports: [
		DirectivesModule,
		RouterModule.forChild(routes)
	],
	exports: [RouterModule]
})
export class BookRoutingModule {
}
