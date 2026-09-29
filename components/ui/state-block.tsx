import type { ReactNode } from "react";
import { Button } from "./button";

interface StateBlockProps {
  title: string;
  children: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
}

export function StateBlock({
  title,
  children,
  actionLabel,
  onAction,
  actionHref,
}: StateBlockProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <h2 className="font-serif text-2xl text-ink">{title}</h2>
      <p className="max-w-md text-sm leading-relaxed text-ink-muted">
        {children}
      </p>
      {actionLabel &&
        (actionHref ? (
          <Button href={actionHref} variant="secondary">
            {actionLabel}
          </Button>
        ) : (
          <Button variant="secondary" onClick={onAction}>
            {actionLabel}
          </Button>
        ))}
    </div>
  );
}
