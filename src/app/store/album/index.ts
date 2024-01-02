import {NgModule} from '@angular/core';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from "@ngrx/effects";
import {AlbumEffects} from "./album.effect";
import {AlbumFeatureKey, albumReducer} from "./reducers";

@NgModule({
	imports: [
		StoreModule.forFeature(AlbumFeatureKey, albumReducer),
		EffectsModule.forFeature([AlbumEffects])
	]
})
export class AlbumStoreModule {
}
