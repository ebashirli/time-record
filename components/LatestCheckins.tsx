import CheckinDetails from "./CheckinDetails";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import prisma from "@/lib/prisma";

const LatestCheckins = async () => {
  const checkins = await prisma.checkin.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      employee: {
        select: {
          // image: true,
          fullName: true,
          company: { select: { name: true } },
        },
      },
    },
  });

  return (
    <Accordion
      type="single"
      collapsible
      className="max-w-lg rounded-lg border"
      defaultValue="billing"
    >
      {checkins?.map((checkin) => {
        return (
          <AccordionItem
            key={checkin.id}
            value={checkin.id}
            className="border-b px-4 last:border-b-0"
          >
            <AccordionTrigger>{checkin.employee.fullName}</AccordionTrigger>
            <AccordionContent>
              <CheckinDetails id={checkin.id} />
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

export default LatestCheckins;
