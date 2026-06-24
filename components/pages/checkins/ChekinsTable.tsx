"use client";

import { Direction } from "@/prisma/lib/generated/prisma/browser";
import React, { useState, useEffect } from "react";
import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "./columns";
import { useSearchParams } from "next/navigation";
import { getCheckins } from "@/actions/getChekins";
import { getCompanies } from "@/actions/getCompanies";
import { getUsers } from "@/actions/getUsers";
import { DateTimePicker } from "@/components/DateTimePicker";
import ExcelDownload from "@/components/ExcelDownload";
import { FormSelectField } from "@/components/FormSelectField";
import { SearchForm } from "@/components/search-form";
import { CheckinRow } from "./types";

type Props = {
  page?: "dashboard";
};
export const CheckinsTable = ({ page }: Props) => {
  const searchParams = useSearchParams();
  const paramsString = searchParams.toString();

  const [data, setData] = useState<CheckinRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loadedParams, setLoadedParams] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, success, total } = await getCheckins(paramsString);
      if (cancelled || !success) return;
      setData(data ?? []);
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
        filters={!page && <Filters />}
        actions={!page && <ExcelDownload />}
      />
    </div>
  );
};

function Filters() {
  return (
    <div className="grid grid-cols-2 sm:flex flex-col md:flex-row w-fit gap-2">
      <SearchForm />
      <FormSelectField
        name="companyId"
        getItems={getCompanies}
        placeholder="By company"
        isFilter
      />

      <FormSelectField
        items={[
          { id: Direction.IN, name: "Giriş" },
          { id: Direction.OUT, name: "Çıxış" },
        ]}
        name="direction"
        placeholder="By direction"
        isFilter
      />

      <FormSelectField
        name="checkedById"
        getItems={getUsers}
        required
        placeholder="By terminal"
        isFilter
      />
      <DateTimePicker name="from" />
      <DateTimePicker name="to" />
    </div>
  );
}
