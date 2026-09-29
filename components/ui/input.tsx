import type { InputHTMLAttributes } from "react";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
}

export function SearchInput({
  id,
  label,
  className = "",
  ...props
}: SearchInputProps) {
  return (
    <input
      id={id}
      type="text"
      autoComplete="url"
      autoCapitalize="off"
      autoCorrect="off"
      spellCheck={false}
      aria-label={label}
      className={`w-full rounded-lg border border-warmline bg-card px-4 py-3 text-base text-ink placeholder:text-ink-faint shadow-whisper transition-colors focus:border-sienna focus:outline-none ${className}`}
      {...props}
    />
  );
}
