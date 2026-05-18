import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"

import { createEvent, getEvent, updateEvent } from "@/api/events"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ROUTES } from "@/routes/paths"

const initialValues = {
  name: "",
  description: "",
  date_time: "",
  max_people: 1,
  location: "",
  tags: [],
}

function validateForm(values) {
  const errors = {}

  if (!values.name.trim()) {
    errors.name = "Введите название мероприятия"
  } else if (values.name.trim().length < 3) {
    errors.name = "Название должно быть не короче 3 символов"
  }

  if (!values.description.trim()) {
    errors.description = "Введите описание мероприятия"
  } else if (values.description.trim().length < 10) {
    errors.description = "Описание должно быть не короче 10 символов"
  }

  if (!values.date_time) {
    errors.date_time = "Выберите дату и время мероприятия"
  }

  if (!values.max_people || values.max_people < 1) {
    errors.max_people = "Количество участников должно быть не менее 1"
  }

  if (!values.location.trim()) {
    errors.location = "Введите место проведения"
  }

  return errors
}

function getErrorMessage(value) {
  if (Array.isArray(value)) {
    return value[0]
  }

  if (typeof value === "string") {
    return value
  }

  return "Ошибка запроса"
}

function normalizeApiErrors(error) {
  const errors = {}

  if (error?.name) {
    errors.name = getErrorMessage(error.name)
  }

  if (error?.description) {
    errors.description = getErrorMessage(error.description)
  }

  if (error?.date_time) {
    errors.date_time = getErrorMessage(error.date_time)
  }

  if (error?.max_people) {
    errors.max_people = getErrorMessage(error.max_people)
  }

  if (error?.location) {
    errors.location = getErrorMessage(error.location)
  }

  return errors
}

function formatDateTimeForInput(dateTime) {
  if (!dateTime) {
    return ""
  }

  return dateTime.slice(0, 16)
}

function getLocationValue(location) {
  if (!location) {
    return ""
  }

  if (typeof location === "string") {
    return location
  }

  return location.name ?? location.address ?? ""
}

function getFormValuesFromEvent(event) {
  return {
    name: event.name ?? "",
    description: event.description ?? "",
    date_time: formatDateTimeForInput(event.date_time),
    max_people: event.max_people ?? 1,
    location: getLocationValue(event.location),
    tags: event.tags ?? [],
  }
}

export default function CreateEvent() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = Boolean(id)
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isEventLoading, setIsEventLoading] = useState(isEditMode)

  useEffect(() => {
    if (!isEditMode) {
      return
    }

    let ignore = false

    async function loadEvent() {
      setIsEventLoading(true)
      try {
        const event = await getEvent(id)
        if (!ignore) {
          setValues(getFormValuesFromEvent(event))
        }
      } catch {
        if (!ignore) {
          setErrors({ form: "Не удалось загрузить мероприятие" })
        }
      } finally {
        if (!ignore) {
          setIsEventLoading(false)
        }
      }
    }

    loadEvent()

    return () => {
      ignore = true
    }
  }, [id, isEditMode])

  function handleInputChange(e) {
    const { name, value } = e.target
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const validationErrors = validateForm(values)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsLoading(true)
    try {
      if (isEditMode) {
        await updateEvent(id, values)
      } else {
        await createEvent(values)
      }
      navigate(ROUTES.events.myEvents)
    } catch (error) {
      const apiErrors = normalizeApiErrors(error)
      setErrors(apiErrors)
    } finally {
      setIsLoading(false)
    }
  }

  const disabled = isLoading || isEventLoading

  return (
    <main className="min-h-[calc(100svh-4rem)] bg-background px-4 py-8">
      <div className="mx-auto w-full max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>
              {isEditMode ? "Изменить мероприятие" : "Создать новое мероприятие"}
            </CardTitle>
            <CardDescription>
              {isEditMode
                ? "Отредактируйте информацию о мероприятии"
                : "Заполните информацию о вашем будущем мероприятии"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.form && (
                <FieldDescription className="text-destructive">
                  {errors.form}
                </FieldDescription>
              )}

              <Field>
                <FieldLabel htmlFor="name">Название мероприятия</FieldLabel>
                <FieldGroup>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Название мероприятия"
                    type="text"
                    value={values.name}
                    onChange={handleInputChange}
                    disabled={disabled}
                  />
                </FieldGroup>
                {errors.name && (
                  <FieldDescription className="text-destructive">
                    {errors.name}
                  </FieldDescription>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="description">Описание</FieldLabel>
                <FieldGroup>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Подробное описание мероприятия"
                    rows={5}
                    value={values.description}
                    onChange={handleInputChange}
                    disabled={disabled}
                    className="rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </FieldGroup>
                {errors.description && (
                  <FieldDescription className="text-destructive">
                    {errors.description}
                  </FieldDescription>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="date_time">Дата и время</FieldLabel>
                <FieldGroup>
                  <Input
                    id="date_time"
                    name="date_time"
                    type="datetime-local"
                    value={values.date_time}
                    onChange={handleInputChange}
                    disabled={disabled}
                  />
                </FieldGroup>
                {errors.date_time && (
                  <FieldDescription className="text-destructive">
                    {errors.date_time}
                  </FieldDescription>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="max_people">
                  Максимум участников
                </FieldLabel>
                <FieldGroup>
                  <Input
                    id="max_people"
                    name="max_people"
                    type="number"
                    min="1"
                    value={values.max_people}
                    onChange={handleInputChange}
                    disabled={disabled}
                  />
                </FieldGroup>
                {errors.max_people && (
                  <FieldDescription className="text-destructive">
                    {errors.max_people}
                  </FieldDescription>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="location">Место проведения</FieldLabel>
                <FieldGroup>
                  <Input
                    id="location"
                    name="location"
                    placeholder="Адрес или название места"
                    type="text"
                    value={values.location}
                    onChange={handleInputChange}
                    disabled={disabled}
                  />
                </FieldGroup>
                {errors.location && (
                  <FieldDescription className="text-destructive">
                    {errors.location}
                  </FieldDescription>
                )}
              </Field>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={disabled}
                  className="flex-1"
                >
                  {isLoading
                    ? isEditMode ? "Сохранение..." : "Создание..."
                    : isEditMode ? "Сохранить изменения" : "Создать событие"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(ROUTES.events.myEvents)}
                  disabled={disabled}
                  className="flex-1"
                >
                  Отменить
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
