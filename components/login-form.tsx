"use client"

import type React from "react"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export function LoginForm({ className, ...props }: React.ComponentProps<"form">) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [forgotPassword, setForgotPassword] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (forgotPassword) {
      return handleForgotPassword()
    }

    setLoading(true)
    try {
      const supabase = createSupabaseBrowserClient()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      toast.success("¡Bienvenido!")
      router.push("/dashboard")
      router.refresh()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al iniciar sesión"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Por favor, ingresa tu email")
      return
    }

    setResetLoading(true)
    try {
      const supabase = createSupabaseBrowserClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) throw error

      toast.success("Se ha enviado un enlace de recuperación a tu email")
      setForgotPassword(false)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al enviar el enlace"
      toast.error(message)
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={onSubmit} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-2">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            {forgotPassword ? "Recuperar contraseña" : "Bienvenido"}
          </h1>
          <p className="text-muted-foreground text-sm text-balance max-w-xs">
            {forgotPassword
              ? "Ingresa tu email para recibir un enlace de recuperación"
              : "Ingresa tus credenciales para acceder al panel de administración"}
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              className="pl-10 h-11 transition-all focus:ring-2 focus:ring-primary/20"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </Field>

        {!forgotPassword && (
          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="password">Contraseña</FieldLabel>
              <button
                type="button"
                onClick={() => setForgotPassword(true)}
                className="text-xs text-primary hover:text-primary/80 underline-offset-4 hover:underline transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 pr-10 h-11 transition-all focus:ring-2 focus:ring-primary/20"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </Field>
        )}

        <Field>
          <Button
            type="submit"
            className="w-full h-11 font-medium shadow-sm hover:shadow transition-all"
            disabled={loading || resetLoading}
          >
            {loading || resetLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>{forgotPassword ? "Enviando..." : "Iniciando sesión..."}</span>
              </div>
            ) : forgotPassword ? (
              "Enviar enlace de recuperación"
            ) : (
              "Iniciar sesión"
            )}
          </Button>
        </Field>

        {forgotPassword && (
          <Field>
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 bg-transparent"
              onClick={() => setForgotPassword(false)}
            >
              Volver al inicio de sesión
            </Button>
          </Field>
        )}

        {!forgotPassword && (
          <Field>
            <FieldDescription className="text-center text-sm">
              ¿No tienes una cuenta?{" "}
              <button
                type="button"
                className="text-primary font-medium hover:text-primary/80 underline-offset-4 hover:underline transition-colors"
                onClick={() => toast.info("Contacta al administrador para obtener acceso")}
              >
                Solicitar acceso
              </button>
            </FieldDescription>
          </Field>
        )}
      </FieldGroup>
    </form>
  )
}
