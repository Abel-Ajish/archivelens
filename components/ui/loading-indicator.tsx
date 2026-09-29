export function LoadingIndicator({ label }: { label: string }) {
  return (
    <div
      className="flex items-center gap-3"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <span className="flex items-center gap-1.5" aria-hidden="true">
        <span className="lens-dot h-1.5 w-1.5 rounded-full bg-sienna" />
        <span className="lens-dot h-1.5 w-1.5 rounded-full bg-sienna" />
        <span className="lens-dot h-1.5 w-1.5 rounded-full bg-sienna" />
      </span>
      <span className="text-sm text-ink-muted">{label}</span>
    </div>
  );
}
