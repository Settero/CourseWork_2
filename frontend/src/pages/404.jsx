import { Link } from "react-router"

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">Страница не найдена</h1>
      <Link to="/" className="text-blue-500 hover:underline">
        Вернуться на главную
      </Link>
    </main>
  )
}