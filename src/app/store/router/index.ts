import {NgModule} from "@angular/core";
import {StoreModule} from "@ngrx/store";
import {NavigationActionTiming, StoreRouterConnectingModule} from "@ngrx/router-store";
import {CustomRouterFeatureKey, customRouterReducer} from "./custom.reducer";
import {CustomSerializer} from "./custom-route-serializer";

@NgModule({
	imports: [
		// StoreModule.forFeature('router', routerReducer),
		StoreModule.forFeature(CustomRouterFeatureKey, customRouterReducer),
		StoreRouterConnectingModule.forRoot({
			serializer: CustomSerializer,
			navigationActionTiming: NavigationActionTiming.PostActivation,
			// routerState: RouterState.Minimal,
		}),
	]
})
export class RouterStoreModule {

}
