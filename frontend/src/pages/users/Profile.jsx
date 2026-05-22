import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { Edit3, Check, X } from "lucide-react"
import { useAuth } from "@/auth/AuthContext"
import { updateCurrentUser } from "@/api/auth"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { ROUTES } from "@/routes/paths"

export default function Profile() {
  const { user, logout, updateUser } = useAuth()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
      })
    }
  }, [user])

  const handleLogout = () => {
    logout()
    navigate(ROUTES.home)
  }

  const handleFieldChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleEditToggle = () => {
    setError(null)
    setIsEditing((prev) => !prev)
  }

  const handleCancel = () => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
      })
    }
    setError(null)
    setIsEditing(false)
  }

  const handleSave = async () => {
    setError(null)
    setIsSaving(true)

    try {
      const updatedUser = await updateCurrentUser({
        first_name: formData.first_name,
        last_name: formData.last_name,
      })
      updateUser(updatedUser)
      setIsEditing(false)
    } catch (err) {
      setError(err?.detail || "Не удалось обновить профиль")
    } finally {
      setIsSaving(false)
    }
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
            <CardHeader className="relative flex flex-col items-center gap-4 text-center">
              <div>
                <CardTitle className="text-2xl">
                  {user.first_name} {user.last_name}
                </CardTitle>
                <div className="mt-2 flex justify-center">
                  <Badge className={`${getRoleColor(user.role)} text-white`}>
                    {getRoleLabel(user.role)}
                  </Badge>
                </div>
              </div>
              <Button
                variant={isEditing ? "secondary" : "outline"}
                size="icon"
                onClick={handleEditToggle}
                className="absolute right-4 top-0"
              >
                <Edit3 />
              </Button>
            </CardHeader>

            <Separator />

            <CardContent className="mt-6 space-y-4">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase text-muted-foreground">Email</p>
                <p className="break-all text-sm font-medium">{user.email}</p>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase text-muted-foreground">Полное имя</p>
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-muted-foreground" htmlFor="first_name">
                        Имя
                      </label>
                      <Input
                        id="first_name"
                        value={formData.first_name}
                        onChange={handleFieldChange('first_name')}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-muted-foreground" htmlFor="last_name">
                        Фамилия
                      </label>
                      <Input
                        id="last_name"
                        value={formData.last_name}
                        onChange={handleFieldChange('last_name')}
                        className="mt-1"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-sm font-medium">
                    {user.first_name} {user.last_name}
                  </p>
                )}
              </div>

              {user.role && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Статус</p>
                  <p className="text-sm font-medium">{getRoleLabel(user.role)}</p>
                </div>
              )}
              {error && <p className="text-sm text-destructive">{error}</p>}
            </CardContent>

            {isEditing ? (
              <CardFooter className="flex flex-col gap-2 px-4 pb-4 pt-2 sm:flex-row sm:justify-end">
                <Button
                  variant="secondary"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  <X className="size-4" />
                  Отмена
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  <Check className="size-4" />
                  Сохранить
                </Button>
              </CardFooter>
            ) : (
              <CardFooter className="flex flex-col justify-center gap-2 px-4 pb-4 pt-2 sm:flex-row">
                <Button variant="destructive" onClick={handleLogout}>
                  Выйти
                </Button>
              </CardFooter>
            )}
          </Card>
        )}
      </div>
    </main>
  )
}
