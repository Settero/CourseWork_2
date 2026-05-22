import { Link } from "react-router"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatEventDateTime, getContrastColor } from "@/lib/utils"

function EventCardBase({ event, statusSlot, actionSlot, href }) {
  const location = typeof event.location === "string"
    ? event.location
    : event.location?.name
  
  const firstTagColor = event.tags?.[0]?.color

  return (
    <Card className="group hover:shadow-lg transition-shadow overflow-hidden pt-0">
      <Link
        to={href ?? "#"}
        className={`block rounded-2xl text-inherit no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${href ? "cursor-pointer" : "cursor-default"}`}
        onClick={(e) => {
          if (!href) e.preventDefault()
        }}
      >
        {event.image ? (
          <div className="w-full h-40 bg-muted overflow-hidden -m-0">
            <img
              src={event.image}
              alt={event.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          </div>
        ) : firstTagColor ? (
          <div 
            className="w-full h-40 overflow-hidden -m-0" 
            style={{ backgroundColor: firstTagColor }}
          />
        ) : null}

        <CardHeader className="pt-4">
          <CardTitle className="break-words">{event.name}</CardTitle>

          {event.tags?.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {event.tags.map((tag) => {
                const bg = tag.color || '#3b82f6'
                const fg = getContrastColor(bg)
                return (
                  <span
                    key={tag.id}
                    style={{ backgroundColor: bg, color: fg }}
                    className="rounded-full px-2.5 py-1 text-xs font-medium"
                  >
                    {tag.name}
                  </span>
                )
              })}
            </div>
          ) : null}

          <CardDescription className="break-words">{event.description}</CardDescription>
        </CardHeader>

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
