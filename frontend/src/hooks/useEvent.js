import { useEffect, useState } from "react"
import { getEvent } from "@/api/events"

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

export function useEvent(eventId) {
  const [event, setEvent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!eventId) return;

    let isActive = true

    async function loadEvent() {
      try {
        setIsLoading(true)
        setError(null)

        const data = await getEvent(eventId)

        if (isActive) {
          setEvent(data)
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

    loadEvent()

    return () => {
      isActive = false
    }
  }, [eventId])

  return {
    event,
    setEvent,
    isLoading,
    error,
  }
}