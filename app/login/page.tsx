import { LoginForm } from "@/components/login-form"
import Image from "next/image"
import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export default async function LoginPage() {
  // Si ya está autenticado, redirigir al dashboard
  const supabase = await createSupabaseServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect("/dashboard")
  }
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex items-center gap-3 md:justify-start justify-center">
          <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 p-2">
            <Image src="/Icono.jpg" alt="SAAVE ARQUITECTO" fill className="object-contain" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-bold tracking-tight">SAAVE</h2>
            <p className="text-sm text-muted-foreground font-medium">ARQUITECTO</p>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>

      <div className="relative hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-background/40 z-10" />
        <img
          src="/001-Banner-Inicial-1-Danta-Cafe-2.jpg"
          alt="SAAVE ARQUITECTO Background"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.7]"
        />
        <div className="absolute bottom-10 left-10 z-20 text-white">
          <h3 className="text-4xl font-bold mb-2">SAAVE ARQUITECTO</h3>
          <p className="text-lg text-white/90">Diseño y construcción de excelencia</p>
        </div>
      </div>
    </div>
  )
}
