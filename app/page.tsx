import { auth } from "@/lib/auth"; // path to your Better Auth server instance
import { connectDB } from "@/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  await connectDB();
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || !session.user) redirect("/login");
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      Welcome
    </div>
  );
}
