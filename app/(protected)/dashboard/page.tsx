// export const iframeHeight = "800px";

import { ChartAreaInteractive } from "@/components/chart-area-interactive";
// import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
// import data from "./data.json";
import { CheckinsTable } from "@/components/pages/checkins/ChekinsTable";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";

// {
//   "id": 2,
//   "header": "Table of contents",
//   "type": "Table of contents",
//   "status": "Done",
//   "target": "29",
//   "limit": "24",
//   "reviewer": "Eddie Lake"
// },

// export const description = "A sidebar with a header and a search form.";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div>
          {/* <DataTable data={data} /> */}
          <Suspense fallback={<Spinner />}>
            <CheckinsTable page="dashboard" />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
