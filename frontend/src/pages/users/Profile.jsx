import { useNavigate } from "react-router"
import { useAuth } from "@/auth/AuthContext"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ROUTES } from "@/routes/paths"

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate(ROUTES.home)
  }

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-500"
      case "organizer":
        return "bg-blue-500"
      case "user":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getRoleLabel = (role) => {
    switch (role) {
      case "admin":
        return "Администратор"
      case "organizer":
        return "Организатор"
      case "user":
        return "Пользователь"
      default:
        return role
    }
  }

  return (
    <main className="flex min-h-[calc(100svh-4rem)] items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {user && (
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                {user.first_name} {user.last_name}
              </CardTitle>
              <div className="mt-2 flex justify-center">
                <Badge className={`${getRoleColor(user.role)} text-white`}>
                  {getRoleLabel(user.role)}
                </Badge>
              </div>
            </CardHeader>

            <Separator />

            <CardContent className="mt-6 space-y-4">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase text-muted-foreground">Email</p>
                <p className="break-all text-sm font-medium">{user.email}</p>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase text-muted-foreground">Полное имя</p>
                <p className="text-sm font-medium">
                  {user.first_name} {user.last_name}
                </p>
              </div>

              {user.role && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Статус</p>
                  <p className="text-sm font-medium">{getRoleLabel(user.role)}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}