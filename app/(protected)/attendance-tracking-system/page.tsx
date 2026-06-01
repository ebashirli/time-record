import { CheckinsTable } from "@/components/pages/checkins/ChekinsTable";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

export default async function Page() {
  return (
    <Suspense fallback={<Spinner />}>
      <CheckinsTable />
    </Suspense>
  );
}
