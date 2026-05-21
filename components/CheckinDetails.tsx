import prisma from "@/lib/prisma";
import dayjs from "dayjs";

const CheckinDetails = async ({ id }: { id: string }) => {
  const checkin = await prisma.checkin.findFirst({
    where: { id },
    select: {
      dateTime: true,
      employee: {
        select: {
          company: { select: { name: true } },
          position: { select: { name: true } },
          // checkins: { where: {dateTime: {lt: day}}, select: {id: true,}},
        },
      },
    },
  });
  return (
    <div>
      <div>{dayjs(checkin?.dateTime).format("DD/MM/YY HH:mm")}</div>
      <div>{checkin?.employee.company.name}</div>
      <div>{checkin?.employee.position.name}</div>
    </div>
  );
};

export default CheckinDetails;
