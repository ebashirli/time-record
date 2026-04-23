import { auth } from "@/lib/auth";
import { Time } from "@/lib/models/Time";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
type Prop = {
  params: Promise<{ id: string }>;
};

const Page = async ({ params }: Prop) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !session.user) redirect("/login");

  const { id } = await params;

  const newTime = new Time({
    employeeId: id,
    postId: session.user.email,
    time: new Date(),
  });
  await newTime.save();

  return <div>Employee Id: {id}</div>;
};

export default Page;
