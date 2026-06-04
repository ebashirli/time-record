import { getDefaultRouteForRole, getServerSession } from "@/lib/auth-session";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession();
  redirect(getDefaultRouteForRole(session?.user.role));
}
