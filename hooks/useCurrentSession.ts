import { useSession } from "@/lib/auth-client";
import { Role } from "@/prisma/lib/generated/prisma/browser";

export const useCurrentSession = () => {
  const session = useSession();
  const user = session?.data?.user;
  const isAdmin = user?.role === Role.ADMIN;
  return { user, session, isAdmin };
};
