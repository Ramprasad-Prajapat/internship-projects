
/**
 * EmptyState component to display when a list or data set is empty.
 * Props:
 *   title: string – headline text
 *   description?: string – optional sub‑text
 *   className?: string – additional Tailwind classes
 */
export const EmptyState = ({ title, description, className = '' }) => (
  <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}> 
    <svg
      className="w-16 h-16 text-slate-500 mb-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 0h6" />
    </svg>
    <h2 className="text-xl font-semibold text-slate-200 mb-2">{title}</h2>
    {description && <p className="text-sm text-slate-400">{description}</p>}
  </div>
);

export default EmptyState;
