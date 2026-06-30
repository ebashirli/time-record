"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { useSearchParams } from "next/navigation";
import { RowSelectionState } from "@tanstack/react-table";
import { ToggleLeft } from "lucide-react";
import { DataTable } from "@/components/data-table/DataTable";
import { SearchForm } from "@/components/search-form";
import { FormSelectField } from "@/components/FormSelectField";
import ExcelDownload from "@/components/ExcelDownload";
import { Button } from "@/components/ui/button";
import { getEmployees } from "@/actions/getEmployees";
import { getCompanies } from "@/actions/getCompanies";
import { getDepartments } from "@/actions/getDepartments";
import { getPositions } from "@/actions/getPositions";
import { toggleEmployeeStatus } from "@/actions/toggleEmployeeStatus";
import { getEmployeeColumns } from "./columns";
import { EmployeeRow } from "./types";

export const EmployeesTable = () => {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isToggling, startToggleTransition] = useTransition();

  const [data, setData] = useState<EmployeeRow[]>([]);
  const [total, setTotal] = useState(0);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const fetchData = useCallback(
    (resetSelection = false) => {
      startTransition(async () => {
        const { data, success, total } = await getEmployees(
          searchParams.toString(),
        );
        if (!success || !data) return;
        if (resetSelection) setRowSelection({});
        setData(data);
        setTotal(total ?? 0);
      });
    },
    [searchParams],
  );

  useEffect(() => {
    fetchData(true);
  }, [fetchData]);

  const columns = useMemo(() => getEmployeeColumns(setData), []);

  const selectedIds = Object.entries(rowSelection)
    .filter(([, selected]) => selected)
    .map(([id]) => id);

  const isActiveParam = searchParams.get("isActive");
  // When filter is "true" (Active), clicking sets them to inactive, and vice versa
  const targetStatus = isActiveParam === "true" ? false : true;
  const showToggle = selectedIds.length > 0 && isActiveParam !== null;

  const handleToggleStatus = () => {
    startToggleTransition(async () => {
      const { success } = await toggleEmployeeStatus(selectedIds, targetStatus);
      if (!success) return;
      setRowSelection({});
      fetchData();
    });
  };

  return (
    <div className="flex h-[calc(100dvh-var(--header-height)-var(--spacing)*4.5)] min-h-0 w-full flex-col overflow-hidden">
      <DataTable
        columns={columns}
        data={data}
        rowCount={total}
        loading={isPending}
        filters={<Filters />}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        actions={
          <>
            {showToggle && (
              <Button
                variant="outline"
                onClick={handleToggleStatus}
                disabled={isToggling}
                className="gap-2"
              >
                <ToggleLeft className="size-4" />
                {targetStatus ? "Set Active" : "Set Inactive"}
              </Button>
            )}
            <ExcelDownload
              endpoint="/api/employees/export"
              filename="employees_report.xlsx"
              selectedIds={selectedIds}
            />
          </>
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
