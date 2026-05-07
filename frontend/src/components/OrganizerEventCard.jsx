import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import { EventCardBase, statusLabels } from "./EventCardBase"

function OrganizerEventCard({ event, user }) {
  const isAuthor = event.organizer.id === user.id
  const canEdit = isAuthor && event.status === "pending"

  return (
    <EventCardBase
      event={event}
      statusSlot={
        <p className="text-sm">
          <span className="text-muted-foreground">Статус: </span>
          <span className="font-medium">
            {statusLabels[event.status]}
          </span>
        </p>
      }
      actionSlot={
        canEdit ? (
          <Button asChild variant="outline" size="sm">
            <Link to={`/organizer/events/${event.id}/edit`}>
              Редактировать
            </Link>
          </Button>
        ) : null
      }
    />
  )
}

export default OrganizerEventCard