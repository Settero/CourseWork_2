async function parseResponse(response) {
    const data = await response.json().catch(() => null)
    if (!response.ok) {
        throw data || {detail: "Ошибка запроса"}
    }
    return data
}

export async function apiRequest(endpoint, options = {}) {
  const access = localStorage.getItem("access")

  const response = await fetch(endpoint, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(access ? { Authorization: `Bearer ${access}` } : {}),
      ...options.headers,
    },
  })

  return parseResponse(response)
}

export async function apiRequestFormData(endpoint, options = {}) {
  const access = localStorage.getItem("access")

  const response = await fetch(endpoint, {
    ...options,
    headers: {
      ...(access ? { Authorization: `Bearer ${access}` } : {}),
      ...options.headers,
    },
  })

  return parseResponse(response)
}

export async function apiRequestBlob(endpoint, options = {}) {
  const access = localStorage.getItem("access")

  const response = await fetch(endpoint, {
    ...options,
    headers: {
      ...(access ? { Authorization: `Bearer ${access}` } : {}),
      ...options.headers,
    },
  })

  if (!response.ok) {
    const data = await response.json().catch(() => null)
    throw data || { detail: "Ошибка запроса" }
  }

  return response.blob()
}
