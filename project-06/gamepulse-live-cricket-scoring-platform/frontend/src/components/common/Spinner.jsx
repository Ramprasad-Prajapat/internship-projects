
/**
 * Simple centered spinner component used throughout the app.
 * Uses Tailwind utility classes and design‑token colors.
 */
export const Spinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-950">
    <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

export default Spinner;
