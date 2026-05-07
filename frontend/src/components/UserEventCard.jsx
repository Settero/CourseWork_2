import { Button } from "@/components/ui/button"
import { EventCardBase } from "./EventCardBase"

function UserEventCard({ event, onRegister, onCancelRegistration }) {
  const freePlaces = event.max_people - event.users_registered_count
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
      actionSlot={
        <Button
          onClick={handleClick}
          disabled={!isRegistered && freePlaces <= 0}
          variant={isRegistered ? "outline" : "default"}
        >
          {isRegistered ? "Отменить запись" : "Зарегистрироваться"}
        </Button>
      }
    />
  )
}

export default UserEventCard