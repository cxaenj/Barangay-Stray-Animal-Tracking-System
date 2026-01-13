import { cn } from '@/lib/utils'

export function Input({ label, helper, error, className, ...props }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
      {label && <span>{label}</span>}
      <input
        className={cn(
          'w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-amber-500 dark:focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:focus:ring-amber-400/20 transition-colors',
          error && 'border-red-400 dark:border-red-500 focus:ring-red-500/20',
          className
        )}
        {...props}
      />
      {helper && !error && <span className="text-xs text-gray-500 dark:text-gray-400">{helper}</span>}
      {error && <span className="text-xs text-red-500 dark:text-red-400">{error}</span>}
    </label>
  )
}
