import { getEvents } from "@/api/events"
import { useEvents } from "@/hooks/useEvent"
import EventsGridPage from "@/components/EventGridPage"
import UserEventCard from "@/components/UserEventCard"

export default function Events() {
  const {
    events,
    setEvents,
    isLoading,
    error,
  } = useEvents(getEvents)

  async function handleRegister(eventId) {
    // await registerForEvent(eventId)

    setEvents((currentEvents) =>
      currentEvents.map((event) =>
        event.id === eventId
          ? {
              ...event,
              is_registered: true,
              users_registered_count: event.users_registered_count + 1,
            }
          : event
      )
    )
  }

  async function handleCancelRegistration(eventId) {
    // await cancelRegistration(eventId)

    setEvents((currentEvents) =>
      currentEvents.map((event) =>
        event.id === eventId
          ? {
              ...event,
              is_registered: false,
              users_registered_count: event.users_registered_count - 1,
            }
          : event
      )
    )
  }

  return (
    <EventsGridPage
      events={events}
      isLoading={isLoading}
      error={error}
      renderCard={(event) => (
        <UserEventCard
          key={event.id}
          event={event}
          onRegister={handleRegister}
          onCancelRegistration={handleCancelRegistration}
        />
      )}
    />
  )
}
