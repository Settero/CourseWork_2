import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router"
import { CalendarDays, MapPin, Users } from "lucide-react"

import { cancelRegistration, deleteEvent, registerForEvent } from "@/api/events"
import { useAuth } from "@/auth/AuthContext"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useEvent } from "@/hooks/useEvent"
import { formatEventDateTime, getContrastColor } from "@/lib/utils"
import { ROUTES } from "@/routes/paths"

export default function EventPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isOrganizer, isUser } = useAuth()
  const { event, setEvent, isLoading, error } = useEvent(id)
  const [actionLoading, setActionLoading] = useState(false)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        Загрузка...
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        Ошибка загрузки события
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        Событие не найдено
      </div>
    )
  }

  const freePlaces = event.free_places
  const isRegistered = event.is_registered
  const organizerId = event.organizer?.id ?? event.organizer_id
  const isOwnOrganizerEvent = isOrganizer && String(organizerId) === String(user?.id)
  const location = typeof event.location === "string"
    ? event.location
    : event.location?.name
  const locationAddress = typeof event.location === "string"
    ? null
    : event.location?.address
  const formattedDateTime = formatEventDateTime(event.date_time)

  async function handleRegister() {
    if (actionLoading || freePlaces <= 0) return

    setActionLoading(true)
    try {
      await registerForEvent(event.id)
      setEvent((current) => ({
        ...current,
        is_registered: true,
        current_reg: current.current_reg + 1,
        free_places: current.free_places - 1,
      }))
    } catch (error) {
      const message = error?.detail || error?.message || ""
      const alreadyRegistered = /уже зарегистрирован|already registered/i.test(message)

      if (alreadyRegistered) {
        setEvent((current) => ({
          ...current,
          is_registered: true,
        }))
      } else {
        console.error("Не удалось зарегистрироваться на мероприятие", error)
      }
    } finally {
      setActionLoading(false)
    }
  }

  async function handleCancel() {
    if (actionLoading || !isRegistered) return

    setActionLoading(true)
    try {
      await cancelRegistration(event.id)
      setEvent((current) => ({
        ...current,
        is_registered: false,
        current_reg: current.current_reg - 1,
        free_places: current.free_places + 1,
      }))
    } finally {
      setActionLoading(false)
    }
  }

  async function handleDelete() {
    if (actionLoading) return

    setActionLoading(true)
    try {
      await deleteEvent(event.id)
      navigate(ROUTES.events.myEvents)
    } finally {
      setActionLoading(false)
    }
  }

  function renderActionButton() {
    if (isOwnOrganizerEvent) {
      if (event.status === "approved") {
        return (
          <Button asChild className="w-full">
            <Link to={`/organizer/events/${event.id}/participants`}>
              Участники
            </Link>
          </Button>
        )
      }

      if (event.status === "pending") {
        return (
          <Button asChild className="w-full" variant="outline">
            <Link to={`/organizer/events/${event.id}/edit`}>
              Изменить мероприятие
            </Link>
          </Button>
        )
      }

      if (event.status === "rejected") {
        return (
          <Button
            className="w-full"
            variant="destructive"
            onClick={handleDelete}
            disabled={actionLoading}
          >
            Удалить
          </Button>
        )
      }
    }

    if (!isUser) {
      return null
    }

    return (
      <Button
        className="w-full"
        onClick={isRegistered ? handleCancel : handleRegister}
        disabled={actionLoading || (!isRegistered && freePlaces <= 0)}
        variant={isRegistered ? "outline" : "default"}
      >
        {isRegistered ? "Отменить запись" : "Зарегистрироваться"}
      </Button>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            {(() => {
              const firstTagColor = event.tags?.[0]?.color
              if (event.image) {
                return (
                  <div className="rounded-2xl overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.name}
                      className="w-full h-96 object-cover"
                    />
                  </div>
                )
              }

              if (firstTagColor) {
                return (
                  <div
                    className="rounded-2xl overflow-hidden h-96"
                    style={{ backgroundColor: firstTagColor }}
                  />
                )
              }

              return null
            })()}

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {event.tags?.map((tag) => {
                  const tagColor = tag.color || '#3b82f6'
                  return (
                    <span
                      key={tag.id}
                      style={{
                        backgroundColor: tagColor,
                        color: '#ffffff'
                      }}
                      className="inline-block px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {tag.name}
                    </span>
                  )
                })}
              </div>

              <div>
                <h1 className="text-4xl font-bold tracking-tight break-words">
                  {event.name}
                </h1>

                <div className="mt-3 space-y-2 text-muted-foreground">
                  {event.organizer?.name ? (
                    <p>Организатор: {event.organizer.name}</p>
                  ) : null}
                  <p>{formattedDateTime}</p>
                  <p>{location}</p>
                </div>
              </div>
            </div>

            <Card className="rounded-2xl">
              <CardContent className="space-y-4 p-6">
                <h2 className="text-xl font-semibold">Описание</h2>
                <p className="leading-7 text-muted-foreground break-words">
                  {event.description}
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardContent className="space-y-4 p-6">
                <h2 className="text-xl font-semibold">Место проведения</h2>
                <div className="flex flex-col gap-3 text-muted-foreground">
                  <div className="flex items-center gap-3 min-w-0">
                    <MapPin className="h-5 w-5 shrink-0" />
                    <div className="min-w-0">
                      <p className="break-words">{location}</p>
                      {locationAddress ? (
                        <p className="text-sm break-words">{locationAddress}</p>
                      ) : null}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="sticky top-6 rounded-2xl">
              <CardContent className="space-y-6 p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <CalendarDays className="h-5 w-5 text-muted-foreground shrink-0" />
                    <span className="break-words">{formattedDateTime}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <span>{event.current_reg} участников</span>
                  </div>

                  <div className="rounded-xl border border-muted/50 bg-muted px-4 py-3 text-sm text-muted-foreground break-words">
                    Свободных мест: {freePlaces}
                  </div>
                </div>

                {renderActionButton()}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
