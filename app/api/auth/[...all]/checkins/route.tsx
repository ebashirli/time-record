import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
type Prop = {
  params: Promise<{ id: string }>;
};

const Page = async ({ params }: Prop) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !session.user) return redirect("/sign-in");

  const { id } = await params;

  const newEntry = await prisma.checkin?.create({
    data: { employeeId: id, postId: session.user.email },
    include: { employee: true },
  });

  console.log({ newEntry });

  if (!newEntry) return null;

  return <div>Employee Id: {newEntry.employeeId}</div>;
};

export default Page;
