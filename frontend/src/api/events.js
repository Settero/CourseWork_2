import { ENDPOINTS } from "./endpoints";
import { apiRequest } from "./client"

export function getEvents() {
  return apiRequest(ENDPOINTS.events.list)
}

export function getOrganizerEvents() {
  return apiRequest(ENDPOINTS.events.organizerList)
}

export function getAdminEvents() {
  return apiRequest(ENDPOINTS.events.adminList)
}

export function updateEventStatus(eventId, status) {
  return apiRequest(ENDPOINTS.events.status(eventId), {
    method: "PATCH",
    body: JSON.stringify({ status }),
  })
}

export function registerForEvent(eventId) {
  return apiRequest(ENDPOINTS.events.register(eventId), {
    method: "POST",
  })
}

export function cancelRegistration(eventId) {
  return apiRequest(ENDPOINTS.events.cancelRegistration(eventId), {
    method: "DELETE",
  })
}