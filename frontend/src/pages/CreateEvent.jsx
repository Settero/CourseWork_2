import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"

import {
  createEvent,
  getEvent,
  getTags,
  updateEvent,
} from "@/api/events"
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
  image: null,
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

  if (!Array.isArray(values.tags) || values.tags.length < 1) {
    errors.tags = "Выберите как минимум один тег"
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

  if (error?.tags) {
    errors.tags = getErrorMessage(error.tags)
  }

  return errors
}

function formatDateTimeForInput(dateTime) {
  if (!dateTime) {
    return ""
  }

  return dateTime.slice(0, 16)
}

function getMinDateTime() {
  const dt = new Date()
  dt.setDate(dt.getDate() + 3)
  const pad = (n) => String(n).padStart(2, "0")
  const yyyy = dt.getFullYear()
  const mm = pad(dt.getMonth() + 1)
  const dd = pad(dt.getDate())
  const hh = pad(dt.getHours())
  const min = pad(dt.getMinutes())
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`
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
    tags: Array.isArray(event.tags)
      ? event.tags.map((tag) => tag.id)
      : [],
    image: null,
  }
}

export default function CreateEvent() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = Boolean(id)
  const [values, setValues] = useState(initialValues)
  const [tags, setTags] = useState([])
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isEventLoading, setIsEventLoading] = useState(isEditMode)
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    let ignore = false

    async function loadTags() {
      try {
        const data = await getTags()
        if (!ignore) {
          setTags(Array.isArray(data) ? data : [])
        }
      } catch {
        if (!ignore) {
          setErrors((prev) => ({
            ...prev,
            form: "Не удалось загрузить теги",
          }))
        }
      }
    }

    loadTags()

    return () => {
      ignore = true
    }
  }, [])

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

  function handleTagToggle(tagId) {
    const normalizedTagId = Number(tagId)

    setValues((prev) => {
      const selected = Array.isArray(prev.tags) ? prev.tags : []
      const nextTags = selected.includes(normalizedTagId)
        ? selected.filter((id) => id !== normalizedTagId)
        : [...selected, normalizedTagId]

      return {
        ...prev,
        tags: nextTags,
      }
    })

    if (errors.tags) {
      setErrors((prev) => ({
        ...prev,
        tags: "",
      }))
    }
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0]
    if (file) {
      setValues((prev) => ({
        ...prev,
        image: file,
      }))

      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)

      if (errors.image) {
        setErrors((prev) => ({
          ...prev,
          image: "",
        }))
      }
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const validationErrors = validateForm(values)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    // Дополнительная проверка: при создании события запрещаем выбирать дату раньше, чем сегодня +3 дня
    if (!isEditMode) {
      try {
        const selected = new Date(values.date_time)
        const min = new Date(getMinDateTime())
        if (selected < min) {
          setErrors((prev) => ({ ...prev, date_time: "Дата должна быть не раньше, чем через 3 дня" }))
          return
        }
      } catch (err) {
        // ignore parsing errors here — входная валидация уже покрывает это
      }
    }

    const formData = new FormData()
    formData.append("name", values.name)
    formData.append("description", values.description)
    formData.append("date_time", values.date_time)
    formData.append("max_people", values.max_people)
    formData.append("location", values.location)
    
    if (values.image instanceof File) {
      formData.append("image", values.image)
    }

    if (Array.isArray(values.tags) && values.tags.length > 0) {
      values.tags.forEach((tagId) => {
        formData.append("tags", Number(tagId))
      })
    }

    setIsLoading(true)
    try {
      if (isEditMode) {
        await updateEvent(id, formData)
      } else {
        await createEvent(formData)
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
                <FieldLabel>Теги</FieldLabel>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => {
                    const tagId = Number(tag.id)
                    const active = values.tags.includes(tagId)
                    const tagColor = tag.color || '#3b82f6'
                    
                    return (
                      <Button
                        key={tag.id}
                        type="button"
                        onClick={() => handleTagToggle(tagId)}
                        disabled={disabled}
                        style={{
                          backgroundColor: active ? tagColor : '#f0f0f0',
                          color: active ? '#ffffff' : '#000000',
                          borderColor: tagColor,
                          borderWidth: '2px'
                        }}
                        className="transition-all hover:opacity-80"
                      >
                        {tag.name}
                      </Button>
                    )
                  })}
                </div>
                {errors.tags && (
                  <FieldDescription className="text-destructive">
                    {errors.tags}
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
                <FieldLabel htmlFor="image">Афиша мероприятия</FieldLabel>
                <FieldGroup>
                  <div className="space-y-4">
                    <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-6 py-10 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
                      onClick={() => document.getElementById('image')?.click()}
                    >
                      <div className="space-y-2">
                        <svg
                          className="mx-auto h-12 w-12 text-muted-foreground"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-8l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 28l3.172-3.172a4 4 0 015.656 0l10.172 10.172"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <p className="text-sm text-muted-foreground">
                          Нажмите или перетащите изображение
                        </p>
                      </div>
                      <input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={disabled}
                        className="hidden"
                      />
                    </div>

                    {imagePreview && (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-40 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setValues(prev => ({ ...prev, image: null }))
                            setImagePreview(null)
                          }}
                          disabled={disabled}
                          className="absolute top-2 right-2 rounded-full bg-destructive text-white p-2 hover:bg-destructive/90 transition-colors"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </FieldGroup>
                {errors.image && (
                  <FieldDescription className="text-destructive">
                    {errors.image}
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
                    min={!isEditMode ? getMinDateTime() : undefined}
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
