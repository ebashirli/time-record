import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "./columns";

// import { useState } from "react";
// import CustomInfiniteScroll from "../../CustomInfiniteScroll";
import { getCheckins } from "@/actions/getChekins";
import { Direction } from "@/prisma/lib/generated/prisma/enums";
// import { useSearchParams } from "next/navigation";
// import { Checkin } from "./types";

export const CheckinsTable = async () => {
  const checkins = await getCheckins({});
  // const searchParams = useSearchParams();

  // const [checkins, setCheckins] = useState<Checkin[]>([]);

  // const query = searchParams.get("query") || "";

  // return (
  //   <CustomInfiniteScroll
  //     key={query}
  //     setData={setCheckins}
  //     getAction={getCheckins}
  //   >

  //   </CustomInfiniteScroll>
  // );
  return (
    <DataTable
      columns={columns}
      data={
        checkins.data?.map((checkin) => ({
          id: checkin.id,
          fullName: checkin.employee.fullName || "Unknown Employee",
          departmentName: checkin.employee.department.name,
          checkedByName: checkin.checkedBy.name || "Unknown Terminal",
          dateTime: checkin.dateTime,
          direction: (checkin.direction === Direction.IN ? "In" : "Out") as
            | "In"
            | "Out",
        })) ?? []
      }
    />
  );
};
