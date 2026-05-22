import { ENDPOINTS } from "./endpoints";
import { apiRequest, apiRequestBlob, apiRequestFormData } from "./client"

export function getEvents() {
  return apiRequest(ENDPOINTS.events.list)
}

export function getEvent(eventId) {
  return apiRequest(ENDPOINTS.events.details(eventId))
}

export function createEvent(eventData) {
  if (eventData instanceof FormData) {
    return apiRequestFormData(ENDPOINTS.events.create, {
      method: "POST",
      body: eventData,
    })
  }
  return apiRequest(ENDPOINTS.events.create, {
    method: "POST",
    body: JSON.stringify(eventData),
  })
}

export function updateEvent(eventId, eventData) {
  if (eventData instanceof FormData) {
    return apiRequestFormData(ENDPOINTS.events.details(eventId), {
      method: "PATCH",
      body: eventData,
    })
  }
  return apiRequest(ENDPOINTS.events.details(eventId), {
    method: "PATCH",
    body: JSON.stringify(eventData),
  })
}

export function getMyEvents() {
  return apiRequest(ENDPOINTS.events.myList)
}

export function getOrganizerEvents() {
  return apiRequest(ENDPOINTS.events.organizerList)
}

export function getTags() {
  return apiRequest(ENDPOINTS.tags)
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

export function deleteEvent(eventId) {
  return apiRequest(ENDPOINTS.events.details(eventId), {
    method: "DELETE",
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

export async function downloadParticipants(eventId) {
  return apiRequestBlob(ENDPOINTS.events.participants(eventId), {
    method: "GET",
  })
}
