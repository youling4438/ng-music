import {ContextFeatureKey, ContextState} from "./reducer";
import {createFeatureSelector, createSelector} from "@ngrx/store";

export const selectContextFeature = createFeatureSelector<ContextState>(ContextFeatureKey)
const selectContextState = (state: ContextState) => state;

export const getUser = createSelector(selectContextState, (state: ContextState) => state.user);
