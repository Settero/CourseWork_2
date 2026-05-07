import { Navigate, Outlet } from "react-router"
import { useAuth } from "./AuthContext"
import { ROUTES } from "@/routes/paths"

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.auth.login} replace />
  }

  return <Outlet />
}