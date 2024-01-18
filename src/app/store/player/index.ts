import {NgModule} from '@angular/core';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from "@ngrx/effects";
import {PlayerEffects} from "./effects";
import {playerReducer, PlayersFeatureKey} from "./reducers";

@NgModule({
	imports: [
		StoreModule.forFeature(PlayersFeatureKey, playerReducer),
		EffectsModule.forFeature([PlayerEffects])
	]
})
export class PlayerStoreModule {}
