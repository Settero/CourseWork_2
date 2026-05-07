import { getOrganizerEvents } from "@/api/events"
import { useAuth } from "@/auth/AuthContext"
import { useEvents } from "@/hooks/useEvent"
import EventsGridPage from "@/components/EventGridPage"
import OrganizerEventCard from "@/components/OrganizerEventCard"

export default function OrganizerEvents() {
  const { user } = useAuth()

  const {
    events,
    isLoading,
    error,
  } = useEvents(getOrganizerEvents)

  return (
    <EventsGridPage
      title="Мои мероприятия"
      events={events}
      isLoading={isLoading}
      error={error}
      emptyText="Вы пока не создали ни одного мероприятия."
      renderCard={(event) => (
        <OrganizerEventCard
          key={event.id}
          event={event}
          user={user}
        />
      )}
    />
  )
}
