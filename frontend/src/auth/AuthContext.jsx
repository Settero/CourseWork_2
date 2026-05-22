import { createContext, useContext, useEffect, useState } from "react"
import { getCurrentUser } from "@/api/auth"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [access, setAccess] = useState(() => localStorage.getItem("access"))
  const [refresh, setRefresh] = useState(() => localStorage.getItem("refresh"))
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user")
    return storedUser ? JSON.parse(storedUser) : null
  })
  const [isLoading, setIsLoading] = useState(Boolean(access && !localStorage.getItem("user")))

  const isAuthenticated = Boolean(access)
  const isUser = user?.role === "user"
  const isOrganizer = user?.role === "organizer"
  const isAdmin = user?.role === "admin"

  function login(accessToken, refreshToken, userData = null) {
    localStorage.setItem("access", accessToken)
    localStorage.setItem("refresh", refreshToken)
    localStorage.setItem("user", JSON.stringify(userData))

    setAccess(accessToken)
    setRefresh(refreshToken)
    setUser(userData)
  }

  function logout() {
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("user")
    localStorage.removeItem("registeredEventIds")

    setAccess(null)
    setRefresh(null)
    setUser(null)
  }

  function updateUser(userData) {
    localStorage.setItem("user", JSON.stringify(userData))
    setUser(userData)
  }

  useEffect(() => {
    if (!access) {
      setIsLoading(false)
      return
    }

    if (user) {
      setIsLoading(false)
      return
    }

    async function fetchUser() {
      try {
        const userData =  await getCurrentUser(access)
        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
      } catch {
        localStorage.removeItem("access")
        localStorage.removeItem("refresh")
        localStorage.removeItem("user")
        setAccess(null)
        setRefresh(null)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [access, user])

  return (
    <AuthContext.Provider
      value={{
        access,
        refresh,
        user,
        isAuthenticated,
        isUser,
        isOrganizer,
        isAdmin,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}