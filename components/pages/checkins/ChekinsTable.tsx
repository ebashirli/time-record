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
  // const didInjectDefaultFrom = React.useRef(false);

  // Ensure we have a default `from` in the URL exactly once.
  // useEffect(() => {
  //   if (searchParams.get("from")) return;
  //   if (didInjectDefaultFrom.current) return;
  //   didInjectDefaultFrom.current = true;

  //   const params = new URLSearchParams(searchParams.toString());
  //   const yesterday = new Date();
  //   yesterday.setDate(yesterday.getDate() - 1);
  //   yesterday.setHours(17, 0, 0, 0);

  //   params.set("from", yesterday.toISOString());
  //   replace(`${pathname}?${params.toString()}`, { scroll: false });
  // }, [pathname, replace, searchParams]);

  // // 2. Handle Data Fetching (Only runs when searchParams actually exist/change)
  useEffect(() => {
    const from = searchParams.get("from");
    if (!from) return;
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

function getYesterday() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(17, 0, 0, 0);
  return yesterday;
}
