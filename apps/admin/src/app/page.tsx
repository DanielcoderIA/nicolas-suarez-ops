import { redirect } from "next/navigation";

export default function HomeRoot() {
  redirect("/dashboard/reservas");
}
