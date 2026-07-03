// src/utils/format.js
import dayjs from 'dayjs'

export function formatDate(date, format = 'YYYY-MM-DD HH:mm') {
  if (!date) return '-'
  return dayjs(date).format(format)
}

export function truncateText(text, maxLength = 100) {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}