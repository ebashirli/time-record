import CheckinDetails from "./CheckinDetails";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Badge } from "./ui/badge";
import { Checkin, Direction } from "@/prisma/lib/generated/prisma/browser";

type TCheckin = Checkin & {
  employee: {
    image: string | null;
    fullName: string | null;
    firstName: string | null;
    lastName: string | null;
    company: { name: string };
  };
};

export const LatestCheckins = ({ checkins }: { checkins: TCheckin[] }) => {
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
