
/**
 * Simple reusable card component.
 * Props:
 *   title: string – card header
 *   children: node – content
 *   className?: string – additional Tailwind classes
 */
export const Card = ({ title, children, className = '' }) => (
  <div className={`bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl ${className}`}>
    {title && <h2 className="text-lg font-bold text-white mb-4">{title}</h2>}
    {children}
  </div>
);

export default Card;
