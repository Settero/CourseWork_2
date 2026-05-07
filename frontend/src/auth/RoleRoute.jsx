import { Navigate, Outlet } from "react-router"
import { useAuth } from "./AuthContext"
import { ROUTES } from "@/routes/paths"

export function RoleRoute({ allowedRoles }) {
  const { user, isLoading, isAuthenticated } = useAuth()

  if (isLoading) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.tools.errorNotFound} replace />
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.tools.errorNotFound} replace />
  }

  return <Outlet />
}