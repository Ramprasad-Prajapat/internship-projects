// FaceTrack AI — Feature flag hooks (frontend-only mode).
// Reactive readers over services/featureControlService via useSyncExternalStore.
// useFeatures() returns the merged catalog+overrides list (recomputed only when
// the overrides object changes), so feature toggles propagate to the Feature
// Control Center, the route <FeatureGate/>, the Sidebar and dashboards instantly.

import { useMemo } from 'react';
import { useSyncExternalStore } from 'react';
import * as fc from '../services/featureControlService';

export function useFeatures() {
  const overrides = useSyncExternalStore(fc.subscribe, fc.getOverrides, fc.getOverrides);
  return useMemo(() => fc.FEATURE_CATALOG.map((cat) => fc.mergeFeature(cat, overrides[cat.key])), [overrides]);
}

export function useFeatureEnabled(key) {
  const features = useFeatures();
  const feat = features.find((x) => x.key === key);
  return feat ? feat.status === 'enabled' : true;
}

export default useFeatures;
