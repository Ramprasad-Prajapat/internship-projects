// FaceTrack AI — useLocation (Phase 4 placeholder).
//
// Geolocation hook scaffold. Phase 1 only exposes the shape; the actual
// browser geolocation + branch-radius logic is implemented in Phase 4.

import { useState, useCallback } from 'react';

export function useLocation() {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);

  // TODO(Phase 4): wire navigator.geolocation + permission handling.
  const requestLocation = useCallback(() => {
    setError('Location tracking is not implemented in Phase 1.');
  }, []);

  return { coords, error, requestLocation };
}

export default useLocation;
