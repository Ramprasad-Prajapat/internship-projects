// FaceTrack AI — LoadingScreen (Phase 1).
// Full-screen loader shown while the initial Firebase auth check resolves.

export default function LoadingScreen({ label = 'Loading…' }) {
  return (
    <div className="ft-loading">
      <div className="ft-spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
