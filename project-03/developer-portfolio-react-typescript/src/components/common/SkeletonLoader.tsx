import React from 'react';
import { cn } from '@/utils/cn';

interface SkeletonProps {
  className?: string;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={cn('animate-pulse rounded-lg bg-slate-800/60 dark:bg-slate-800/80', className)}
        />
      ))}
    </>
  );
};

export const SkeletonPageLoader: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-4 max-w-2xl">
        <Skeleton className="h-10 w-3/4 rounded-xl" />
        <Skeleton className="h-5 w-1/2 rounded-lg" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4">
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-6 w-2/3 rounded-lg" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-4/5 rounded-md" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
