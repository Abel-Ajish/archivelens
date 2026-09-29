"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { isValidUrl, normalizeUrl } from "@/lib/wayback/utils";
import { Button } from "./button";
import { SearchInput } from "./input";

interface SearchFormProps {
  initialValue?: string;
  autoFocus?: boolean;
  compact?: boolean;
}

export function SearchForm({
  initialValue = "",
  autoFocus = false,
  compact = false,
}: SearchFormProps) {
  const router = useRouter();
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!isValidUrl(value)) {
      setError("That doesn't look like a valid website address.");
      return;
    }
    setError(null);
    router.push(`/archive/${normalizeUrl(value)}`);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full">
      <div
        className={`flex ${compact ? "flex-row" : "flex-col sm:flex-row"} gap-3`}
      >
        <SearchInput
          id="archive-url"
          label="Enter a website URL"
          placeholder="Enter a website URL"
          value={value}
          autoFocus={autoFocus}
          onChange={(event) => {
            setValue(event.target.value);
            if (error) setError(null);
          }}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "archive-url-error" : undefined}
          className={compact ? "flex-1" : "flex-1"}
        />
        <Button type="submit" className={compact ? "" : "sm:w-auto w-full"}>
          Explore
        </Button>
      </div>
      {error && (
        <p id="archive-url-error" role="alert" className="mt-3 text-sm text-rose">
          {error}
        </p>
      )}
    </form>
  );
}
