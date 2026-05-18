import {
  Field,
  FieldContent,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function InOrOutChoice() {
  return (
    <RadioGroup name="direction" defaultValue="in" className="max-w-sm flex">
      <FieldLabel htmlFor="in">
        <Field orientation="vertical">
          <FieldContent>
            <FieldTitle>In</FieldTitle>
          </FieldContent>
          <RadioGroupItem value="in" id="in" className="hidden" />
        </Field>
      </FieldLabel>
      <FieldLabel htmlFor="out">
        <Field orientation="vertical">
          <FieldContent>
            <FieldTitle>Out</FieldTitle>
          </FieldContent>
          <RadioGroupItem value="out" id="out" className="hidden" />
        </Field>
      </FieldLabel>
    </RadioGroup>
  );
}
