import { Link, useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/auth/AuthContext"
import { ROUTES } from "@/routes/paths"

function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate(ROUTES.home)
  }

  return (
    <header className="sticky top-0 z-50 h-16 w-full border-b border-border bg-background">
      <div className="relative mx-auto flex h-full max-w-6xl items-center justify-between px-4">
        <Link
          to={ROUTES.home}
          className="text-xl font-semibold tracking-tight text-foreground">
          Афиша
        </Link>

        <nav className="absolute left-1/2 flex -translate-x-1/2 items-center gap-8">
          <Link
            to={ROUTES.home}
            className="text-xl font-semibold text-muted-foreground transition-colors hover:text-foreground">
            Мероприятия
          </Link>

        {user?.role === "organizer" ? (
            <>
            <Link
                to={ROUTES.events.myEvents}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Мои мероприятия
            </Link>
            </>
        ) : user?.role === "user" ? (
            <>
            <Link
                to={ROUTES.events.myRegistations}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Мои регистрации
            </Link>
            </>
        ) : user?.role === "admin" ? (
            <>
            <Link
                to={ROUTES.events.adminPanel}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Админ-панель
            </Link>
            </>
        ) : null}
        </nav>

        <div>
          {user ? (
            <>
              <Button variant="ghost" asChild>
                <Link to={ROUTES.user.profile}>{user.first_name}</Link>
              </Button>

              <Button variant="ghost" onClick={handleLogout}>
                Выйти
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to={ROUTES.auth.login}>Войти</Link>
              </Button>

              <Button asChild>
                <Link to={ROUTES.auth.register}>Регистрация</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header