import { cn } from '@/lib/utils'

export function Card({ children, className }) {
  return (
    <div className={cn('rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm', className)}>
      {children}
    </div>
  )
}

export function CardBody({ children, className }) {
  return <div className={cn('p-4 sm:p-6', className)}>{children}</div>
}

export function CardHeader({ title, description, className, action }) {
  return (
    <div className={cn('flex items-start justify-between gap-4 p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700', className)}>
      <div>
        {title && <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>}
        {description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
