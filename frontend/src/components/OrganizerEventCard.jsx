import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import { statusLabels } from "@/constants/eventStatus"
import { EventCardBase } from "./EventCardBase"

function OrganizerEventCard({ event, onDelete, onDownloadParticipants }) {
  const canEdit = event.status === "pending"
  const canDelete = event.status === "rejected"
  const canViewParticipants = event.status === "approved"

  function handleDelete() {
    onDelete(event.id)
  }

  function renderAction() {
    if (canEdit) {
      return (
        <Button asChild variant="outline" size="sm">
          <Link to={`/organizer/events/${event.id}/edit`}>
            Редактировать
          </Link>
        </Button>
      )
    }

    if (canDelete) {
      return (
        <Button variant="destructive" size="sm" onClick={handleDelete}>
          Удалить
        </Button>
      )
    }

    if (canViewParticipants) {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDownloadParticipants(event.id)}
        >
          Скачать список участников
        </Button>
      )
    }

    return null
  }

  return (
    <EventCardBase
      event={event}
      href={`/events/${event.id}`}
      statusSlot={
        <p className="text-sm">
          <span className="text-muted-foreground">Статус: </span>
          <span className="font-medium">
            {statusLabels[event.status]}
          </span>
        </p>
      }
      actionSlot={renderAction()}
    />
  )
}

export default OrganizerEventCard
