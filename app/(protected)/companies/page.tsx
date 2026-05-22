import { CompaniesList } from "@/components/pages/CompaniesList";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

export default async function Page() {
  return (
    <Suspense fallback={<Spinner />}>
      <CompaniesList />
    </Suspense>
  );
}
