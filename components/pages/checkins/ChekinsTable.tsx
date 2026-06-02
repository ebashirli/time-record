"use client";

import { Direction } from "@/prisma/lib/generated/prisma/browser";
import React, { useState, useTransition, useEffect } from "react";
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

export const CheckinsTable = () => {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [data, setData] = useState<CheckinRow[]>([]);
  useEffect(() => {
    startTransition(async () => {
      const result = await getCheckins(searchParams.toString());
      if (result instanceof Response) return;
      if (result.success) setData(result.data ?? []);
    });
  }, [searchParams]);

  return (
    <div className="w-full h-[calc(100vh-var(--header-height)-var(--spacing)*4.5)] overflow-clip">
      <DataTable
        columns={columns}
        data={data}
        loading={isPending}
        filters={<Filters />}
        actions={<ExcelDownload />}
      />
    </div>
  );
};

function Filters() {
  const searchParams = useSearchParams();

  function getYesterday() {
    const from = searchParams.get("from");
    if (from) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(17, 0, 0, 0);
    return yesterday;
  }

  return (
    <div className="flex flex-col md:flex-row w-fit gap-2">
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
      <DateTimePicker name="from" defaultValue={getYesterday()} />
      <DateTimePicker name="to" />
    </div>
  );
}
