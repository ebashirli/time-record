import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";

export const FormSelectField = <T extends { id: string; name: string }>({
  items,
  errors,
  name,
  label,
  required = false,
  defaultValue,
}: {
  items?: T[];
  errors?: Record<string, string[]>;
  name: string;
  label: string;
  required?: boolean;
  defaultValue?: string;
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Select name={name} defaultValue={defaultValue}>
        <SelectTrigger>
          <SelectValue placeholder={"Select " + label.toLowerCase()} />
        </SelectTrigger>
        <SelectContent>
          {items?.map((item) => (
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
