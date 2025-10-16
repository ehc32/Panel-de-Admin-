import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Si hay sesión activa, redirigir al dashboard
  if (session) {
    redirect("/dashboard");
  }
  
  // Si no hay sesión, redirigir al login
  redirect("/login");
}
