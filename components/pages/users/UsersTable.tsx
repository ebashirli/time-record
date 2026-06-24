"use client";

// import { Direction } from "@/prisma/lib/generated/prisma/browser";
import { useState, useEffect } from "react";
import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "./columns";
import { useSearchParams } from "next/navigation";
import { getUsers } from "@/actions/users";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { Role } from "@/prisma/lib/generated/prisma/client";
import { useCurrentSession } from "@/hooks/useCurrentSession";
// import { getCompanies } from "@/actions/getCompanies";
// import { getUsers } from "@/actions/getUsers";
// import { DateTimePicker } from "@/components/DateTimePicker";
// import ExcelDownload from "@/components/ExcelDownload";
// import { FormSelectField } from "@/components/FormSelectField";
// import { SearchForm } from "@/components/search-form";
// import { CheckinRow } from "./types";

type User = {
  id: string;
  createdAt: Date;
  email: string;
  name: string | null;
  role: Role;
  image: string | null;
  // emailVerified: boolean;
  // updatedAt: Date;
};

export const UsersTable = () => {
  const searchParams = useSearchParams();
  const paramsString = searchParams.toString();
  const { isAdmin } = useCurrentSession();

  const [data, setData] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loadedParams, setLoadedParams] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, success, total } = await getUsers(paramsString);
      if (cancelled || !success || !data) return;
      setData(data);
      setTotal(total ?? 0);
      setLoadedParams(paramsString);
    })();
    return () => {
      cancelled = true;
    };
  }, [paramsString]);

  const loading = loadedParams !== paramsString;

  return (
    <div className="flex h-[calc(100dvh-var(--header-height)-var(--spacing)*4.5)] min-h-0 w-full flex-col overflow-hidden">
      <DataTable
        columns={columns}
        data={data}
        rowCount={total}
        loading={loading}
        // filters={!page && <Filters />}
        actions={
          isAdmin && (
            <Button size="icon" variant="link" asChild>
              <Link href="/users/add">
                <PlusIcon />
              </Link>
            </Button>
          )
        }
      />
    </div>
  );
};

// function Filters() {
//   return (
//     <div className="grid grid-cols-2 sm:flex flex-col md:flex-row w-fit gap-2">
//       <SearchForm />
//       <FormSelectField
//         name="companyId"
//         getItems={getCompanies}
//         placeholder="By company"
//         isFilter
//       />

//       <FormSelectField
//         items={[
//           { id: Direction.IN, name: "Giriş" },
//           { id: Direction.OUT, name: "Çıxış" },
//         ]}
//         name="direction"
//         placeholder="By direction"
//         isFilter
//       />

//       <FormSelectField
//         name="checkedById"
//         getItems={getUsers}
//         required
//         placeholder="By terminal"
//         isFilter
//       />
//       <DateTimePicker name="from" />
//       <DateTimePicker name="to" />
//     </div>
//   );
// }
