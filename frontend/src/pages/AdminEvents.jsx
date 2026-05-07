import { getAdminEvents, updateEventStatus } from "@/api/events"
import { useEvents } from "@/hooks/useEvent"
import EventsGridPage from "@/components/EventGridPage"
import AdminEventCard from "@/components/AdminEventCard"

export default function AdminEvents() {
  const {
    events,
    setEvents,
    isLoading,
    error,
  } = useEvents(getAdminEvents)

  async function handleStatusChange(eventId, newStatus) {
    await updateEventStatus(eventId, newStatus)

    setEvents((currentEvents) =>
      currentEvents.map((event) =>
        event.id === eventId
          ? { ...event, status: newStatus }
          : event
      )
    )
  }

  return (
    <EventsGridPage
      title="Модерация мероприятий"
      events={events}
      isLoading={isLoading}
      error={error}
      emptyText="Нет мероприятий для модерации."
      renderCard={(event) => (
        <AdminEventCard
          key={event.id}
          event={event}
          onStatusChange={handleStatusChange}
        />
      )}
    />
  )
}
