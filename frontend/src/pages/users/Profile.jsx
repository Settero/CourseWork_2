import { Link } from "react-router"
import { useAuth } from "@/auth/AuthContext"

export default function Profile() {
  const { user } = useAuth()

  return (
    <main className="flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">Профиль пользователя</h1>
      {user && (
        <div>
          <p>Имя: {user.first_name} {user.last_name}</p>
          <p>Email: {user.email}</p>
          <p>Роль: {user.role}</p>
        </div>
      )}
    </main>
  )
}