import CheckinDetails from "./CheckinDetails";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import prisma from "@/lib/prisma";
import { Badge } from "./ui/badge";
import { Direction } from "@/prisma/lib/generated/prisma/browser";

const LatestCheckins = async () => {
  const checkins = await prisma.checkin.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      employee: {
        select: {
          image: true,
          fullName: true,
          firstName: true,
          lastName: true,
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
            <AccordionTrigger>
              <Badge
                className="mr-2 w-10"
                variant={
                  checkin.direction === Direction.OUT
                    ? "destructive"
                    : "outline"
                }
              >
                {checkin.direction}
              </Badge>
              {checkin.employee.fullName}
            </AccordionTrigger>
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
