import { redirect } from "next/navigation"

// The dashboard entry point. Send the admin straight to the Home editor.
export default function AdminIndexPage() {
  redirect("/admin/home")
}
