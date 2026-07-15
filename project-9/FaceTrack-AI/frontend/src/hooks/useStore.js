// FaceTrack AI — Store hooks (frontend-only mode).
// Reactive readers over services/mockStore via useSyncExternalStore. Each
// returns a referentially-stable slice that only changes when that slice is
// mutated, so unrelated updates don't re-render the component.

import { useSyncExternalStore } from 'react';
import * as store from '../services/mockStore';

export function useCollection(key) {
  return useSyncExternalStore(
    store.subscribe,
    () => store.getAll(key),
    () => store.getAll(key)
  );
}

export function useSettings() {
  return useSyncExternalStore(
    store.subscribe,
    () => store.getState().settings,
    () => store.getState().settings
  );
}

export default useCollection;
