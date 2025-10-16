import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const adminEmail = process.env.ADMIN_EMAIL;
  const isAdmin = session?.user?.email && adminEmail && session.user.email === adminEmail;

  if (isAdmin) redirect("/dashboard");
  redirect("/login");
}
