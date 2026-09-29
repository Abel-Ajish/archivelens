import { getProvider } from "@/lib/wayback/providers";

export function ProviderTag({ providerId }: { providerId: string }) {
  const provider = getProvider(providerId);
  return (
    <span className="text-xs text-ink-faint">{provider.name}</span>
  );
}
