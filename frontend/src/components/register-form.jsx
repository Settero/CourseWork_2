import { useState } from "react"
import { Link } from "react-router"

import { cn } from "@/lib/utils"
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
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  confirmPassword: "",
}

function validateForm(values) {
  const errors = {}

  if (!values.first_name.trim()) {
    errors.first_name = "Введите имя."
  } else if (values.first_name.trim().length < 2) {
    errors.first_name = "Имя должно быть не короче 2 символов."
  }

  if (!values.last_name.trim()) {
    errors.last_name = "Введите фамилию."
  } else if (values.last_name.trim().length < 2) {
    errors.last_name = "Фамилия должна быть не короче 2 символов."
  }

  if (!values.email.trim()) {
    errors.email = "Введите адрес электронной почты."
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Введите корректный email."
  }

  if (!values.password) {
    errors.password = "Введите пароль."
  } else if (values.password.length < 8) {
    errors.password = "Пароль должен быть не короче 8 символов."
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Подтвердите пароль."
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Пароли не совпадают."
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

  return "Ошибка запроса."
}

function normalizeApiErrors(error) {
  const errors = {}

  if (error?.first_name) {
    errors.first_name = getErrorMessage(error.first_name)
  }

  if (error?.last_name) {
    errors.last_name = getErrorMessage(error.last_name)
  }

  if (error?.email) {
    errors.email = getErrorMessage(error.email)
  }

  if (error?.username) {
    errors.email = getErrorMessage(error.username)
  }

  if (error?.password) {
    errors.password = getErrorMessage(error.password)
  }

  if (error?.detail) {
    errors.form = getErrorMessage(error.detail)
  }

  if (error?.non_field_errors) {
    errors.form = getErrorMessage(error.non_field_errors)
  }

  if (Object.keys(errors).length === 0) {
    errors.form = "Не удалось создать аккаунт."
  }

  return errors
}

export function RegisterForm({ onSubmit, className, ...props }) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target

    const nextValues = {
      ...values,
      [name]: value,
    }

    setValues(nextValues)

    if (isSubmitted) {
      setErrors(validateForm(nextValues))
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()

    setIsSubmitted(true)

    const validationErrors = validateForm(values)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    try {
      setIsSubmitting(true)
      await onSubmit(values)
    } catch (error) {
      setErrors(normalizeApiErrors(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Зарегистрируйтесь</CardTitle>
          <CardDescription>
            Введите данные ниже, чтобы создать аккаунт
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} noValidate>
            <FieldGroup>
              {errors.form && (
                <FieldDescription className="text-destructive text-center">
                  {errors.form}
                </FieldDescription>
              )}

              <Field data-invalid={errors.first_name ? "" : undefined}>
                <FieldLabel htmlFor="first_name">Имя</FieldLabel>
                <Input
                  id="first_name"
                  name="first_name"
                  type="text"
                  placeholder="Иван"
                  value={values.first_name}
                  onChange={handleChange}
                  aria-invalid={!!errors.first_name}
                />
                {errors.first_name && (
                  <FieldDescription>{errors.first_name}</FieldDescription>
                )}
              </Field>

              <Field data-invalid={errors.last_name ? "" : undefined}>
                <FieldLabel htmlFor="last_name">Фамилия</FieldLabel>
                <Input
                  id="last_name"
                  name="last_name"
                  type="text"
                  placeholder="Иванов"
                  value={values.last_name}
                  onChange={handleChange}
                  aria-invalid={!!errors.last_name}
                />
                {errors.last_name && (
                  <FieldDescription>{errors.last_name}</FieldDescription>
                )}
              </Field>

              <Field data-invalid={errors.email ? "" : undefined}>
                <FieldLabel htmlFor="email">
                  Адрес электронной почты
                </FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="mail@example.com"
                  value={values.email}
                  onChange={handleChange}
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <FieldDescription>{errors.email}</FieldDescription>
                )}
              </Field>

              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field data-invalid={errors.password ? "" : undefined}>
                    <FieldLabel htmlFor="password">Пароль</FieldLabel>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={values.password}
                      onChange={handleChange}
                      aria-invalid={!!errors.password}
                    />
                    {errors.password && (
                      <FieldDescription>{errors.password}</FieldDescription>
                    )}
                  </Field>

                  <Field data-invalid={errors.confirmPassword ? "" : undefined}>
                    <FieldLabel htmlFor="confirm-password">
                      Подтвердите пароль
                    </FieldLabel>
                    <Input
                      id="confirm-password"
                      name="confirmPassword"
                      type="password"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      aria-invalid={!!errors.confirmPassword}
                    />
                    {errors.confirmPassword && (
                      <FieldDescription>
                        {errors.confirmPassword}
                      </FieldDescription>
                    )}
                  </Field>
                </Field>

                {!errors.password && !errors.confirmPassword && (
                  <FieldDescription>Минимум 8 символов.</FieldDescription>
                )}
              </Field>

              <Field>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Создание аккаунта..." : "Создать аккаунт"}
                </Button>

                <FieldDescription className="text-center">
                  Уже есть аккаунт?{" "}
                  <Link to={ROUTES.auth.login} className="underline underline-offset-4">
                    Войти
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}