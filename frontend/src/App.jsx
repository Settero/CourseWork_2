import { Routes, Route } from "react-router"

import Events from "@/pages/Events"
import Register from "@/pages/users/Register"
import Login from "@/pages/users/Login"
import MainLayout from "@/layouts/MainLayout"
import Profile from "@/pages/users/Profile"
import MyEvents from "@/pages/MyEvents"
import MyRegistrations from "@/pages/MyRegistation"
import AdminPanel from "@/pages/AdminEvents"
import NotFound from "@/pages/404"

import { ProtectedRoute } from "@/auth/ProtectedRoute"
import { RoleRoute } from "@/auth/RoleRoute"
import { ROUTES } from "./routes/paths"

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />} >

        <Route path={ROUTES.home} element={<Events />} />

        <Route element={<ProtectedRoute />} >
          <Route path={ROUTES.user.profile} element={<Profile />} />
        </Route>

        <Route element={<RoleRoute allowedRoles={["user"]} />}>
          <Route path={ROUTES.events.myRegistations} element={<MyRegistrations />} />
        </Route>

        <Route element={<RoleRoute allowedRoles={["organizer"]} />}>
           <Route path={ROUTES.events.myEvents} element={<MyEvents />} />
        </Route>
        
        <Route element={<RoleRoute allowedRoles={["admin"]} />}>
          <Route path={ROUTES.events.adminPanel} element={<AdminPanel />} />
        </Route>
      </Route>

      <Route path={ROUTES.auth.register} element={<Register />} />
      <Route path={ROUTES.auth.login} element={<Login />} />
      <Route path={ROUTES.tools.errorNotFound} element={<NotFound />} />
    </Routes>
  )
}

export default App