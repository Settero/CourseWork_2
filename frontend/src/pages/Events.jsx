import { cancelRegistration, getEvents, registerForEvent } from "@/api/events"
import { useState } from "react"
import { useEvents } from "@/hooks/useEvent"
import EventsGridPage from "@/components/EventGridPage"
import UserEventCard from "@/components/UserEventCard"
import { addRegisteredEventId, getRegisteredEventIds, removeRegisteredEventId } from "@/lib/utils"

export default function Events() {
  const {
    events,
    setEvents,
    isLoading,
    error,
  } = useEvents(getEvents)
  const [actionLoading, setActionLoading] = useState(null)
  const [registeredEventIds, setRegisteredEventIds] = useState(() => getRegisteredEventIds())

  async function handleRegister(eventId) {
    if (actionLoading) return

    setActionLoading(eventId)
    try {
      await registerForEvent(eventId)
      addRegisteredEventId(eventId)
      setRegisteredEventIds((prev) => new Set([...prev, String(eventId)]))
      setEvents((currentEvents) =>
        currentEvents.map((event) =>
          event.id === eventId
            ? {
                ...event,
                is_registered: true,
                current_reg: event.current_reg + 1,
                free_places: event.free_places - 1,
              }
            : event
        )
      )
    } catch (error) {
      const message = error?.detail || error?.message || ""
      const alreadyRegistered = /уже зарегистрирован|already registered/i.test(message)

      if (alreadyRegistered) {
        addRegisteredEventId(eventId)
        setRegisteredEventIds((prev) => new Set([...prev, String(eventId)]))
        setEvents((currentEvents) =>
          currentEvents.map((event) =>
            event.id === eventId
              ? {
                  ...event,
                  is_registered: true,
                }
              : event
          )
        )
      } else {
        console.error("Не удалось зарегистрироваться на мероприятие", error)
      }
    } finally {
      setActionLoading(null)
    }
  }

  async function handleCancelRegistration(eventId) {
    if (actionLoading) return

    setActionLoading(eventId)
    try {
      await cancelRegistration(eventId)
      removeRegisteredEventId(eventId)
      setRegisteredEventIds((prev) => {
        const next = new Set(prev)
        next.delete(String(eventId))
        return next
      })
      setEvents((currentEvents) =>
        currentEvents.map((event) =>
          event.id === eventId
            ? {
                ...event,
                is_registered: false,
                current_reg: event.current_reg - 1,
                free_places: event.free_places + 1,
              }
            : event
        )
      )
    } catch (error) {
      console.error("Не удалось отменить регистрацию", error)
    } finally {
      setActionLoading(null)
    }
  }

  function normalizeEvent(event) {
    return {
      ...event,
      is_registered: event.is_registered || registeredEventIds.has(String(event.id)),
    }
  }

  return (
    <EventsGridPage
      title="Мероприятия"
      events={events.map(normalizeEvent)}
      isLoading={isLoading}
      error={error}
      renderCard={(event) => (
        <UserEventCard
          key={event.id}
          event={event}
          onRegister={handleRegister}
          onCancelRegistration={handleCancelRegistration}
          isLoading={actionLoading === event.id}
        />
      )}
    />
  )
}
