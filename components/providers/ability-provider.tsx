// components/providers/ability-provider.tsx
"use client";

import { ReactNode } from "react";
import { AbilityContext } from "@/lib/casl/hooks";
import { AppAbility } from "@/lib/casl/abilities";

interface AbilityProviderProps {
  ability: AppAbility;
  children: ReactNode;
}

export function AbilityProvider({ ability, children }: AbilityProviderProps) {
  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
}
