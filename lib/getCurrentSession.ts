import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const getCurrentSession = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;
  return { session, user };
};

export default getCurrentSession;
