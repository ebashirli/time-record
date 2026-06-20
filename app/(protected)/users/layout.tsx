import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

// import { getServerSession, isAdminRole } from "@/lib/auth-session";
import { UsersTable } from "@/components/pages/users/UsersTable";

type Props = {
  children: React.ReactNode;
};

export default async function Layout({ children }: Props) {
  // const session = await getServerSession();
  // const isAdmin = isAdminRole(session?.user.role);
  // if (!isAdmin) return null;

  return (
    <div className="relative">
      <Suspense fallback={<Spinner />}>
        <UsersTable />
      </Suspense>
      {children}
    </div>
  );
}
