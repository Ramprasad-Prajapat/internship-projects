// FaceTrack AI — useRole (Phase 1).
// Convenience hook returning just the current user's role (or null).
import { useAuth } from './useAuth';

export function useRole() {
  return useAuth().role;
}

export default useRole;
