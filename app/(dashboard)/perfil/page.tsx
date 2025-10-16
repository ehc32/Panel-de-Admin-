"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, User, Save, AlertCircle } from "lucide-react"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export default function PerfilPage() {
  const router = useRouter()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)

  // Form states
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const supabase = createSupabaseBrowserClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.user) {
        router.replace("/login")
        return
      }

      setUser(session.user)
      setEmail(session.user.email || "")
    }
    getUser()
  }, [router])

  // Función para validar email
  const isValidEmail = (email: string): { isValid: boolean; message?: string } => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    
    if (!emailRegex.test(email)) {
      return { isValid: false, message: "Formato de email inválido" }
    }

    // Dominios bloqueados por Supabase
    const blockedDomains = [
      'example.com', 'test.com', 'localhost', 'example.org', 'example.net',
      'test.org', 'test.net', 'sample.com', 'demo.com', 'fake.com'
    ]
    
    const domain = email.split('@')[1]?.toLowerCase()
    if (blockedDomains.includes(domain)) {
      return { 
        isValid: false, 
        message: `El dominio @${domain} no está permitido. Usa un correo electrónico real.` 
      }
    }

    return { isValid: true }
  }

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault()

    const sanitizedEmail = email.trim().toLowerCase()

    // Validar que el email haya cambiado
    if (sanitizedEmail === user?.email?.toLowerCase()) {
      toast.error("El email no ha cambiado")
      return
    }

    // Validar el NUEVO email antes de enviar a Supabase
    const newEmailValidation = isValidEmail(sanitizedEmail)
    if (!newEmailValidation.isValid) {
      toast.error(newEmailValidation.message || "Email inválido")
      return
    }

    // Validar que el email ACTUAL no esté en la lista de bloqueados
    const currentEmailValidation = isValidEmail(user?.email?.toLowerCase() || "")
    if (!currentEmailValidation.isValid) {
      toast.error(
        "Tu correo actual usa un dominio de prueba. Por favor, contacta al administrador del sistema para actualizar tu cuenta.",
        { duration: 6000 }
      )
      return
    }

    setLoading(true)
    try {
      const supabase = createSupabaseBrowserClient()

      const { data, error } = await supabase.auth.updateUser({
        email: sanitizedEmail,
      })

      if (error) {
        console.error("[v0] Email update error:", error)
        
        // Manejo más específico de errores
        if (error.message.includes("invalid") || error.message.includes("Invalid")) {
          toast.error("El correo electrónico no es válido. Verifica que sea un correo real y activo.")
        } else if (error.message.includes("already registered") || error.message.includes("already exists")) {
          toast.error("Este correo ya está registrado en el sistema.")
        } else if (error.message.includes("rate limit")) {
          toast.error("Demasiados intentos. Espera unos minutos antes de intentar nuevamente.")
        } else {
          toast.error(error.message || "Error al actualizar email")
        }
        return
      }

      console.log("[v0] Email update response:", data)

      // Actualizar el email en el estado local para reflejar el cambio pendiente
      toast.success(
        "¡Correo de confirmación enviado! Revisa tu bandeja de entrada (tanto el correo antiguo como el nuevo) y haz clic en el enlace para confirmar el cambio.",
        { duration: 8000 },
      )
    } catch (err: unknown) {
      console.error("[v0] Email update failed:", err)
      const message = err instanceof Error ? err.message : "Error al actualizar email"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentPassword) {
      toast.error("Ingresa tu contraseña actual")
      return
    }

    if (!newPassword || !confirmPassword) {
      toast.error("Completa todos los campos de contraseña")
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas nuevas no coinciden")
      return
    }

    if (newPassword.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres")
      return
    }

    if (newPassword === currentPassword) {
      toast.error("La nueva contraseña debe ser diferente a la actual")
      return
    }

    setPasswordLoading(true)
    try {
      const supabase = createSupabaseBrowserClient()

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || "",
        password: currentPassword,
      })

      if (signInError) {
        toast.error("Contraseña actual incorrecta")
        return
      }

      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) {
        console.error("[v0] Password update error:", error)
        throw error
      }

      console.log("[v0] Password update response:", data)

      toast.success("Contraseña actualizada correctamente. Redirigiendo...")

      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")

      // Wait a bit before signing out
      setTimeout(async () => {
        await supabase.auth.signOut()
        router.replace("/login")
      }, 1500)
    } catch (err: unknown) {
      console.error("[v0] Password update failed:", err)
      const message = err instanceof Error ? err.message : "Error al actualizar contraseña"
      toast.error(message)
    } finally {
      setPasswordLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  const initials = user.email?.split("@")[0].slice(0, 2).toUpperCase() || "AD"

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6">
      <div>
        <h1 className="text-3xl font-bold">Mi Perfil</h1>
        <p className="text-muted-foreground mt-2">Gestiona tu información personal y configuración de seguridad</p>
      </div>

      {/* Información del perfil */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Información Personal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-medium">Administrador</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Último acceso: {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString("es-ES") : "N/A"}
              </p>
            </div>
          </div>

          <Separator />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cambiar Email */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Cambiar Correo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isValidEmail(user?.email?.toLowerCase() || "").isValid && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <strong>⚠️ Correo con dominio de prueba detectado</strong>
                  <p className="mt-1">
                    Tu correo actual ({user?.email}) usa un dominio bloqueado. No podrás cambiar tu correo desde aquí. 
                    Contacta al administrador del sistema para actualizar tu cuenta.
                  </p>
                </AlertDescription>
              </Alert>
            )}
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <div className="space-y-1">
                  <p>Recibirás correos de confirmación en ambas direcciones. Debes hacer clic en el enlace para completar el cambio.</p>
                  <p className="text-xs text-muted-foreground">
                    <strong>Nota:</strong> No se permiten correos con dominios de prueba como @example.com, @test.com, etc.
                  </p>
                </div>
              </AlertDescription>
            </Alert>

            <form onSubmit={handleUpdateEmail} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Nuevo Correo Electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`pl-10 ${
                      email && email !== user?.email && !isValidEmail(email.trim().toLowerCase()).isValid
                        ? "border-destructive focus-visible:ring-destructive"
                        : ""
                    }`}
                    placeholder="tu@correo.com"
                  />
                </div>
                {email && email !== user?.email && !isValidEmail(email.trim().toLowerCase()).isValid && (
                  <p className="text-sm text-destructive">
                    {isValidEmail(email.trim().toLowerCase()).message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={
                  loading || 
                  email.trim().toLowerCase() === user.email?.toLowerCase() ||
                  !isValidEmail(email.trim().toLowerCase()).isValid ||
                  !isValidEmail(user?.email?.toLowerCase() || "").isValid
                }
                className="w-full"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Actualizando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Actualizar Email
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Cambiar contraseña */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Cambiar Contraseña
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Contraseña Actual</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="pl-10 pr-10"
                    placeholder="Tu contraseña actual"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Nueva Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10 pr-10"
                    placeholder="Mínimo 6 caracteres"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10"
                    placeholder="Repite la contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={passwordLoading || !currentPassword || !newPassword || !confirmPassword}
                className="w-full"
              >
                {passwordLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Actualizando...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Cambiar Contraseña
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
