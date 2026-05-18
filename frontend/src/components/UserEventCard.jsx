import { Button } from "@/components/ui/button"
import { EventCardBase } from "./EventCardBase"

function UserEventCard({ event, onRegister, onCancelRegistration, isLoading }) {
  const freePlaces = event.free_places
  const isRegistered = event.is_registered

  function handleClick() {
    if (isRegistered) {
      onCancelRegistration(event.id)
    } else {
      onRegister(event.id)
    }
  }

  return (
    <EventCardBase
      event={event}
      href={`/events/${event.id}`}
      actionSlot={
        <Button
          onClick={handleClick}
          disabled={isLoading || (!isRegistered && freePlaces <= 0)}
          variant={isRegistered ? "outline" : "default"}
        >
          {isRegistered ? "Отменить запись" : "Зарегистрироваться"}
        </Button>
      }
    />
  )
}

export default UserEventCard
