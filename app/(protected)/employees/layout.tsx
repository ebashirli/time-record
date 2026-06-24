import { EmployeesTable } from "@/components/pages/employees/EmployeesTable";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="relative">
      <Suspense fallback={<Spinner />}>
        <EmployeesTable />
      </Suspense>

      {children}
    </div>
  );
}
