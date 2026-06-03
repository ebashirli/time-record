import { Button } from "./ui/button";
import { Tooltip } from "@/components/Tooltip";
import { cn } from "@/lib/utils";

type Props = {
  icon: React.ReactNode;
  variant?: "destructive" | "ghost" | "link" | "outline" | "secondary";
  tooltip?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  asChild?: boolean;
};

export const IconButton = ({
  icon,
  variant = "outline",
  tooltip,
  className,
  onClick,
  disabled,
  asChild,
}: Props) => {
  return (
    <Tooltip content={tooltip}>
      <Button
        size="icon"
        asChild={asChild}
        variant={variant}
        className={cn("min-w-10 cursor-pointer", className)}
        onClick={onClick}
        disabled={disabled}
      >
        {icon}
      </Button>
    </Tooltip>
  );
};
