"use client";

import React, { useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Option = {
  id: string;
  name: string;
};

type Props<T extends Option> = {
  items?: T[];
  getItems?: (paramsString?: string) => Promise<{ data?: T[] }>;
  errors?: Record<string, string[]>;
  name: string;
  label?: string;
  required?: boolean;
  defaultValue?: string;
  placeholder?: string;
  isFilter?: boolean;
};

export const FormSelectField = <T extends Option>({
  items,
  getItems,
  errors,
  name,
  label,
  required = false,
  defaultValue,
  placeholder,
  isFilter,
}: Props<T>) => {
  const [isPending, startTransition] = useTransition();

  const [itemsState, setItemsState] = React.useState<T[]>(items || []);
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const paramValue = searchParams.get(name);

  React.useEffect(() => {
    const handleGetItems = () => {
      startTransition(async () => {
        const { data } = (await getItems?.()) ?? {};
        if (data) setItemsState(data);
      });
    };

    handleGetItems();
  }, [getItems]);

  const handleValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(name, value);
    else params.delete(name);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-2 w-44">
      {label && (
        <Label htmlFor={name}>
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <Select
        name={name}
        key={paramValue || "__empty__"}
        defaultValue={paramValue || defaultValue}
        onValueChange={isFilter ? handleValueChange : undefined}
        disabled={isPending}
      >
        <SelectTrigger
          className={cn(
            "w-full py-0",
            paramValue !== null && "[&>svg:last-child]:hidden!",
          )}
        >
          <SelectValue
            placeholder={placeholder || "Select " + label?.toLowerCase()}
          />
          {paramValue !== null ? (
            <div
              role="button"
              tabIndex={-1}
              onClick={handleValueChange.bind(null, "")}
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="text-muted-foreground hover:text-foreground flex size-4 items-center justify-center rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none"
            >
              <XIcon className="size-4" />
              <span className="sr-only">Clear selection</span>
            </div>
          ) : null}
        </SelectTrigger>
        <SelectContent>
          {itemsState?.map((item) => (
            <SelectItem key={item.id} value={item.id}>
              {item.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors?.[name] && (
        <p className="text-sm text-red-500">{errors[name][0]}</p>
      )}
    </div>
  );
};
