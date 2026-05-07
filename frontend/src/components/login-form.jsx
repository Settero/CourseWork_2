import { useState } from "react"
import { Link } from "react-router"

import { cn } from "@/lib/utils"
import { ROUTES } from "@/routes/paths"
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

const initialValues = {
  email: "",
  password: "",
}

function validateForm(values) {
  const errors = {}

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

  if (error?.email) {
    errors.email = getErrorMessage(error.email)
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
    errors.form = "Не удалось войти в аккаунт."
  }

  return errors
}

export function LoginForm({ onSubmit, className, ...props }) {
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
          <CardTitle className="text-xl">Войти</CardTitle>
          <CardDescription>
            Введите ваш email и пароль ниже
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} noValidate>
            <FieldGroup>
              {errors.form && (
                <FieldDescription className="text-center text-destructive">
                  {errors.form}
                </FieldDescription>
              )}

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

              <Field data-invalid={errors.password ? "" : undefined}>
                <FieldLabel htmlFor="password">Пароль</FieldLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={values.password}
                  onChange={handleChange}
                  aria-invalid={!!errors.password}
                />
                {errors.password && (
                  <FieldDescription>{errors.password}</FieldDescription>
                )}
              </Field>

              <Field>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Вход..." : "Войти"}
                </Button>

                <FieldDescription className="text-center">
                  Нет аккаунта?{" "}
                  <Link
                    to={ROUTES.auth.register}
                    className="underline underline-offset-4"
                  >
                    Зарегистрироваться
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