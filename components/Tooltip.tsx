import React from "react";

import {
  Tooltip as STooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const Tooltip = ({
  children,
  content,
}: {
  children: React.ReactNode;
  content?: string;
}) => {
  return (
    <STooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      {content && (
        <TooltipContent>
          <p>{content}</p>
        </TooltipContent>
      )}
    </STooltip>
  );
};
