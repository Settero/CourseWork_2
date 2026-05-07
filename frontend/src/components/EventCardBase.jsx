import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const statusLabels = {
  pending: "На рассмотрении",
  approved: "Одобрено",
  rejected: "Отклонено",
  archived: "В архиве",
}

function EventCardBase({ event, statusSlot, actionSlot }) {
  const freePlaces = event.max_people - event.users_registered_count

  return (
    <Card>
      <CardHeader>
        <CardTitle>{event.name}</CardTitle>
        <CardDescription>{event.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">
          {event.location.name}
        </p>

        <p className="text-sm text-muted-foreground">
          {event.date_time}
        </p>

        {statusSlot}
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Свободных мест: {freePlaces}
        </p>

        {actionSlot}
      </CardFooter>
    </Card>
  )
}

export { EventCardBase, statusLabels }