import {NgModule} from "@angular/core";
import {StoreModule} from "@ngrx/store";
import {BookFeatureKey, bookReducerFunc,} from "./reducer";

@NgModule({
	imports: [
		StoreModule.forFeature(BookFeatureKey, bookReducerFunc),
	],
})
export class BookStoreModule {
}
