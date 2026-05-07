function EventsGridPage({
  title,
  events,
  isLoading,
  error,
  renderCard,
  emptyText = "Мероприятий пока нет.",
}) {
  if (isLoading) {
    return <div>Загрузка мероприятий...</div>
  }

  if (error) {
    return <div>Не удалось загрузить мероприятия.</div>
  }

  return (
    <main className="min-h-[calc(100svh-4rem)] bg-background px-4 py-8">
      <section className="mx-auto w-full max-w-6xl space-y-6">
        {title ? (
          <h1 className="text-3xl font-bold tracking-tight">
            {title}
          </h1>
        ) : null}

        {events.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => renderCard(event))}
          </div>
        ) : (
          <p className="text-muted-foreground">{emptyText}</p>
        )}
      </section>
    </main>
  )
}

export default EventsGridPage