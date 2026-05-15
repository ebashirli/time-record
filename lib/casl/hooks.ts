// lib/casl/hooks.ts
import { useContext, createContext } from "react";
import { AppAbility } from "./abilities";
import { createContextualCan } from "@casl/react";
import { PureAbility } from "@casl/ability";

const emptyAbility = new PureAbility() as AppAbility;

export const AbilityContext = createContext<AppAbility>(emptyAbility);

export const Can = createContextualCan(AbilityContext.Consumer);

export function useAbility() {
  const ability = useContext(AbilityContext);
  if (!ability) {
    throw new Error("useAbility must be used within AbilityContext.Provider");
  }
  return ability;
}
