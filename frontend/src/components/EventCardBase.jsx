import { Link } from "react-router"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatEventDateTime } from "@/lib/utils"

function EventCardBase({ event, statusSlot, actionSlot, href }) {
  const location = typeof event.location === "string"
    ? event.location
    : event.location?.name

  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <Link
        to={href ?? "#"}
        className={`block rounded-2xl text-inherit no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${href ? "cursor-pointer" : "cursor-default"}`}
        onClick={(e) => {
          if (!href) e.preventDefault()
        }}
      >
        <CardHeader>
          <CardTitle className="break-words">{event.name}</CardTitle>
          <CardDescription className="break-words">{event.description}</CardDescription>
        </CardHeader>

        {event.tags?.length > 0 ? (
          <CardContent className="flex flex-wrap gap-2 px-6 pt-2">
            {event.tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full border border-muted/50 bg-muted px-2.5 py-1 text-xs font-medium text-foreground"
              >
                {tag.name}
              </span>
            ))}
          </CardContent>
        ) : null}

        <CardContent className="space-y-2 min-w-0">
          <p className="text-sm text-muted-foreground break-words">
            {location}
          </p>

          <p className="text-sm text-muted-foreground break-words">
            {formatEventDateTime(event.date_time)}
          </p>

          {statusSlot}
        </CardContent>
      </Link>

      <CardFooter className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground break-words">
          Свободных мест: {event.free_places}
        </p>

        {actionSlot}
      </CardFooter>
    </Card>
  )
}

export { EventCardBase }
