import { useState } from "react"
import { cancelRegistration, getMyEvents } from "@/api/events"
import { useEvents } from "@/hooks/useEvent"
import EventsGridPage from "@/components/EventGridPage"
import UserEventCard from "@/components/UserEventCard"
import { getRegisteredEventIds, removeRegisteredEventId } from "@/lib/utils"

export default function MyRegistrations() {
  const {
    events,
    setEvents,
    isLoading,
    error,
  } = useEvents(getMyEvents)
  const [actionLoading, setActionLoading] = useState(null)
  const [registeredEventIds, setRegisteredEventIds] = useState(() => getRegisteredEventIds())

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
        currentEvents.filter((event) => event.id !== eventId)
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
      title="Мои регистрации"
      events={events.map(normalizeEvent).filter((event) => event.is_registered)}
      isLoading={isLoading}
      error={error}
      emptyText="Вы не зарегистрированы ни на одно мероприятие."
      renderCard={(event) => (
        <UserEventCard
          key={event.id}
          event={event}
          onRegister={() => {}}
          onCancelRegistration={handleCancelRegistration}
          isLoading={actionLoading === event.id}
        />
      )}
    />
  )
}