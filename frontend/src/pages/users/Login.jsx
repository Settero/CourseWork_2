import { GalleryVerticalEnd } from "lucide-react"
import { Link, useNavigate } from "react-router"

import { LoginForm } from "@/components/login-form"
import { useAuth } from "@/auth/AuthContext"
import { getCurrentUser, loginUser } from "@/api/auth"
import { ROUTES } from "@/routes/paths"

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleLogin(values) {
    const tokens = await loginUser({
      email: values.email,
      password: values.password,
    })

    const userData = await getCurrentUser(tokens.access)

    login(tokens.access, tokens.refresh, userData)

    navigate(ROUTES.home, { replace: true })
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          to={ROUTES.home}
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Афиша
        </Link>

        <LoginForm onSubmit={handleLogin} />
      </div>
    </div>
  )
}