import clsx from 'clsx'

export function cn(...classes) {
  return clsx(...classes)
}

export function formatDate(date) {
  if (!date) return 'N/A'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}

export function formatDateTime(date) {
  if (!date) return 'N/A'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(date)
}

export function generateTagId(species = 'cat') {
  const prefix = species === 'dog' ? 'DOG' : 'CAT'
  const randomNum = Math.floor(Math.random() * 900000) + 100000
  return `${prefix}-${randomNum}`
}
