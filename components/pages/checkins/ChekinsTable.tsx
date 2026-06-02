"use client";

import React, { useState, useTransition, useEffect } from "react";
import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "./columns";
import { useSearchParams } from "next/navigation";
import { getCheckins } from "@/actions/getChekins";
import { getCompanies } from "@/actions/getCompanies";
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
    <DataTable
      columns={columns}
      data={data}
      loading={isPending}
      filters={<Filters />}
      actions={<ExcelDownload />}
    />
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
    <div className="grid md:grid-cols-4 gap-2 w-fit">
      <SearchForm />
      <FormSelectField
        name="companyId"
        getItems={getCompanies}
        required
        placeholder="Filter by company"
        isFilter
      />
      <DateTimePicker name="from" defaultValue={getYesterday()} />
      <DateTimePicker name="to" />
    </div>
  );
}
