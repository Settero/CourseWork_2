import { EventCardBase } from "./EventCardBase"

function AdminEventCard({ event, onStatusChange }) {
  function handleStatusChange(eventChange) {
    onStatusChange(event.id, eventChange.target.value)
  }

  return (
    <EventCardBase
      event={event}
      statusSlot={
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            Статус мероприятия
          </p>

          <select
            value={event.status}
            onChange={handleStatusChange}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="pending" disabled>
              На рассмотрении
            </option>
            <option value="approved">
              Одобрить
            </option>
            <option value="rejected">
              Отклонить
            </option>
          </select>
        </div>
      }
    />
  )
}

export default AdminEventCard