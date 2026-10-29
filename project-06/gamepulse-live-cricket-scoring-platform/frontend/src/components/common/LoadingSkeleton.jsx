
/**
 * Generic loading skeleton used as placeholder while content loads.
 * Accepts optional `className` to adjust size/shape.
 */
export const LoadingSkeleton = ({ className = 'h-4 w-full' }) => (
  <div className={`bg-slate-700 rounded ${className} animate-pulse`} />
);

export default LoadingSkeleton;
