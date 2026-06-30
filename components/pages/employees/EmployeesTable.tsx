"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { DataTable } from "@/components/data-table/DataTable";
import { SearchForm } from "@/components/search-form";
import { FormSelectField } from "@/components/FormSelectField";
import ExcelDownload from "@/components/ExcelDownload";
import { getEmployees } from "@/actions/getEmployees";
import { getCompanies } from "@/actions/getCompanies";
import { getDepartments } from "@/actions/getDepartments";
import { getPositions } from "@/actions/getPositions";
import { getEmployeeColumns } from "./columns";
import { EmployeeRow } from "./types";

export const EmployeesTable = () => {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [data, setData] = useState<EmployeeRow[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    startTransition(async () => {
      const { data, success, total } = await getEmployees(
        searchParams.toString(),
      );
      if (!success || !data) return;
      setData(data);
      setTotal(total ?? 0);
    });
  }, [searchParams]);

  const columns = useMemo(() => getEmployeeColumns(setData), []);

  return (
    <div className="flex h-[calc(100dvh-var(--header-height)-var(--spacing)*4.5)] min-h-0 w-full flex-col overflow-hidden">
      <DataTable
        columns={columns}
        data={data}
        rowCount={total}
        loading={isPending}
        filters={<Filters />}
        actions={
          <ExcelDownload
            endpoint="/api/employees/export"
            filename="employees_report.xlsx"
          />
        }
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
        name="departmentId"
        getItems={getDepartments}
        placeholder="By department"
        isFilter
      />
      <FormSelectField
        name="positionId"
        getItems={getPositions}
        placeholder="By position"
        isFilter
      />
      <FormSelectField
        name="isActive"
        items={[
          { id: "true", name: "Active" },
          { id: "false", name: "Inactive" },
        ]}
        placeholder="By status"
        isFilter
      />
    </div>
  );
}
