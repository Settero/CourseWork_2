export const ENDPOINTS = {
    auth: {
        register: "/auth/users/",
        login:"/auth/jwt/create/",
        me:"/auth/users/me/"
    },
    events: {
        list: "/api/events/",
        create: "/api/events/",
        details: (eventId) => `/api/events/${eventId}/`,
        myList: "/api/events/registered/",
        organizerList: "/api/events/my/",
        adminList: "/api/events/admin/pending/",
        status: (eventId) => `/api/events/${eventId}/status/`,
        register: (eventId) => `/api/events/${eventId}/register/`,
        cancelRegistration: (eventId) => `/api/events/${eventId}/register/`,
        participants: (eventId) => `/api/events/${eventId}/participants/`,
    },
}