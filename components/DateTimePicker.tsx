"use client";

import * as React from "react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CalendarIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function DateTimePicker({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: Date;
}) {
  const searchParams = useSearchParams();
  const field = searchParams.get(name);
  const committedDate = field ? new Date(field) : null;

  const [draftDate, setDraftDate] = React.useState<Date | null>(committedDate);
  const [isOpen, setIsOpen] = React.useState(false);

  const { replace } = useRouter();
  const pathname = usePathname();

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setDraftDate(committedDate ?? defaultValue ?? null);
    }
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    const next = new Date(selectedDate);
    if (draftDate) {
      next.setHours(
        draftDate.getHours(),
        draftDate.getMinutes(),
        draftDate.getSeconds(),
        draftDate.getMilliseconds(),
      );
    }
    setDraftDate(next);
  };

  const handleTimeChange = (type: "hour" | "minute", value: string) => {
    const base = draftDate ?? new Date();
    const next = new Date(base);
    if (type === "hour") {
      next.setHours(parseInt(value, 10));
    } else {
      next.setMinutes(parseInt(value, 10));
    }
    setDraftDate(next);
  };

  const applyParams = (date: Date | null) => {
    const params = new URLSearchParams(searchParams);
    if (date) params.set(name, date.toISOString());
    else params.delete(name);
    params.delete("page");
    replace(`${pathname}?${params.toString()}`);
  };

  const handleConfirm = () => {
    if (!draftDate) return;
    applyParams(draftDate);
    setIsOpen(false);
  };

  const handleClear = () => {
    applyParams(null);
    setDraftDate(null);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-between text-left font-normal w-44",
            !committedDate && "text-muted-foreground",
          )}
        >
          {committedDate ? (
            format(committedDate, "dd/MM/yyyy HH:mm")
          ) : (
            <span className="text-xs">DD/MM/YYYY HH:mm</span>
          )}
          <CalendarIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="sm:flex">
          <Calendar
            mode="single"
            selected={draftDate ?? undefined}
            onSelect={handleDateSelect}
          />
          <div className="flex flex-col sm:flex-row sm:h-75 divide-y sm:divide-y-0 sm:divide-x">
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {hours.reverse().map((hour) => (
                  <Button
                    key={hour}
                    size="icon"
                    variant={
                      draftDate && draftDate.getHours() === hour
                        ? "default"
                        : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange("hour", hour.toString())}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                  <Button
                    key={minute}
                    size="icon"
                    variant={
                      draftDate && draftDate.getMinutes() === minute
                        ? "default"
                        : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() =>
                      handleTimeChange("minute", minute.toString())
                    }
                  >
                    {minute.toString().padStart(2, "0")}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 border-t p-2">
          <Button variant="ghost" size="sm" onClick={handleClear}>
            Clear
          </Button>
          <Button size="sm" onClick={handleConfirm} disabled={!draftDate}>
            Ok
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
