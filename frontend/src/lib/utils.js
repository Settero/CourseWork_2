import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatEventDateTime(value) {
  if (!value) {
    return ""
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")

  return `${year}.${month}.${day} ${hours}:${minutes}`
}

const REGISTERED_EVENTS_KEY = "registeredEventIds"

export function getRegisteredEventIds() {
  try {
    return new Set(
      JSON.parse(localStorage.getItem(REGISTERED_EVENTS_KEY) ?? "[]")
        .map(String)
    )
  } catch {
    return new Set()
  }
}

export function addRegisteredEventId(eventId) {
  try {
    const current = new Set(getRegisteredEventIds())
    current.add(String(eventId))
    localStorage.setItem(REGISTERED_EVENTS_KEY, JSON.stringify([...current]))
  } catch {
    // ignore storage errors
  }
}

export function removeRegisteredEventId(eventId) {
  try {
    const current = getRegisteredEventIds()
    current.delete(String(eventId))
    localStorage.setItem(REGISTERED_EVENTS_KEY, JSON.stringify([...current]))
  } catch {
    // ignore storage errors
  }
}

export function clearRegisteredEventIds() {
  localStorage.removeItem(REGISTERED_EVENTS_KEY)
}

export function getContrastColor(hex) {
  try {
    if (!hex) return '#000000'
    const h = hex.replace('#', '')
    if (h.length !== 6) return '#000000'
    const r = parseInt(h.substring(0,2), 16)
    const g = parseInt(h.substring(2,4), 16)
    const b = parseInt(h.substring(4,6), 16)
    // Per ITU-R BT.709
    const luminance = (0.2126*r + 0.7152*g + 0.0722*b) / 255
    return luminance > 0.6 ? '#000000' : '#ffffff'
  } catch {
    return '#000000'
  }
}
