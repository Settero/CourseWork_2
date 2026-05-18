import { Link } from "react-router"
import { deleteEvent, downloadParticipants, getOrganizerEvents } from "@/api/events"
import { useEvents } from "@/hooks/useEvent"
import { Button } from "@/components/ui/button"
import OrganizerEventCard from "@/components/OrganizerEventCard"
import { ROUTES } from "@/routes/paths"

export default function OrganizerEvents() {
  const {
    events,
    setEvents,
    isLoading,
    error,
  } = useEvents(getOrganizerEvents)

  async function handleDelete(eventId) {
    await deleteEvent(eventId)

    setEvents((currentEvents) =>
      currentEvents.filter((event) => event.id !== eventId)
    )
  }

  async function handleDownloadParticipants(eventId) {
    try {
      const blob = await downloadParticipants(eventId)
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `participants-${eventId}.txt`
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Не удалось скачать список участников", error)
    }
  }

  if (isLoading) {
    return <div className="min-h-[calc(100svh-4rem)] flex items-center justify-center">Загрузка мероприятий...</div>
  }

  if (error) {
    return <div className="min-h-[calc(100svh-4rem)] flex items-center justify-center">Не удалось загрузить мероприятия.</div>
  }

  return (
    <main className="min-h-[calc(100svh-4rem)] bg-background px-4 py-8">
      <section className="mx-auto w-full max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Мои мероприятия</h1>
          <Button asChild>
            <Link to={ROUTES.events.create}>Создать событие</Link>
          </Button>
        </div>

        {events.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <OrganizerEventCard
                key={event.id}
                event={event}
                onDelete={handleDelete}
                onDownloadParticipants={handleDownloadParticipants}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Вы пока не создали ни одного мероприятия.</p>
        )}
      </section>
    </main>
  )
}
