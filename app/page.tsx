import { getDefaultRouteForRole, getServerSession } from "@/lib/auth-session";
import { Role } from "@/prisma/lib/generated/prisma/enums";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession();
  return redirect(getDefaultRouteForRole(session?.user.role as Role));
}
