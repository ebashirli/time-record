import UserAddPage from "@/components/pages/users/user-add-edit-page";
import { UserDetailsModal } from "@/components/pages/users/UserDetailsModal";
import prisma from "@/lib/prisma";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  const user =
    id === "add" ? null : await prisma.user.findUnique({ where: { id } });

  return id === "add" ? (
    <UserAddPage user={null} />
  ) : (
    <UserDetailsModal user={user} />
  );
}
