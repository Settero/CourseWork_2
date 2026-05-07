import { useEffect, useState } from "react"

export function useEvents(fetchEvents) {
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isActive = true

    async function loadEvents() {
      try {
        setIsLoading(true)
        setError(null)

        const data = await fetchEvents()

        if (isActive) {
          setEvents(data)
        }
      } catch (error) {
        if (isActive) {
          setError(error)
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    loadEvents()

    return () => {
      isActive = false
    }
  }, [fetchEvents])

  return {
    events,
    setEvents,
    isLoading,
    error,
  }
}