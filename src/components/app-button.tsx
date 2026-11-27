import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

const VARIANTS = {
  primary: { variant: "default", size: "default" },
  secondary: { variant: "outline", size: "sm" },
} as const;

export interface AppButtonProps {
  variant?: keyof typeof VARIANTS;
  onClick: () => void;
  children: ReactNode;
}

export function AppButton({ variant = "primary", onClick, children }: AppButtonProps) {
  return (
    <Button type="button" {...VARIANTS[variant]} onClick={onClick}>
      {children}
    </Button>
  );
}
