import { ENDPOINTS } from "./endpoints";
import { apiRequest } from "./client"

export function registerUser(values) {
  return apiRequest(ENDPOINTS.auth.register, {
    method: "POST",
    body: JSON.stringify({
      username: values.email,
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      password: values.password,
    }),
  })
}

export function loginUser(values) {
  return apiRequest(ENDPOINTS.auth.login, {
    method: "POST",
    body: JSON.stringify({
      email: values.email,
      password: values.password,
    }),
  })
}

export function getCurrentUser(access) {
  return apiRequest(ENDPOINTS.auth.me, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access}`,
    },
  })
}

export function updateCurrentUser(values) {
  return apiRequest(ENDPOINTS.auth.me, {
    method: "PATCH",
    body: JSON.stringify(values),
  })
}