import type { ArchiveProvider, ProviderCapture, ProviderResult } from "./types";
import { waybackProvider } from "./wayback";
import { arquivoProvider } from "./arquivo";
import { commonCrawlProvider } from "./commoncrawl";
import { icelandProvider } from "./iceland";
import {
  ukWebArchive,
  stanfordArchive,
  nlaAustralia,
  nlnz,
  croatianArchive,
  czechArchive,
  estonianArchive,
  japaneseWarp,
  bibliothecaAlexandrina,
  archiveIt,
  danishArchive,
  norwegianArchive,
  swedishArchive,
  finnishArchive,
  germanArchive,
  frenchArchive,
  spanishArchive,
  italianArchive,
  belgianArchive,
  swissArchive,
  austrianArchive,
  irishArchive,
  greekArchive,
  turkishArchive,
  russianArchive,
  chineseArchive,
  koreanArchive,
  indianArchive,
  canadianArchive,
  mexicanArchive,
  brazilianArchive,
  argentineArchive,
  chileanArchive,
  colombianArchive,
  peruvianArchive,
  venezuelanArchive,
  ecuadorianArchive,
  bolivianArchive,
  paraguayanArchive,
  uruguayanArchive,
  costaRicanArchive,
  panamanianArchive,
  cubanArchive,
  dominicanArchive,
  puertoRicanArchive,
  jamaicanArchive,
  trinidadArchive,
  barbadosArchive,
  bahamasArchive,
  bermudaArchive,
  caymanArchive,
  turksCaicosArchive,
  bviArchive,
  anguillaArchive,
  montserratArchive,
  guadeloupeArchive,
  martiniqueArchive,
  stBarthelemyArchive,
  stMartinArchive,
  sintMaartenArchive,
  stKittsArchive,
  antiguaArchive,
  dominicaArchive,
  stLuciaArchive,
  stVincentArchive,
  grenadaArchive,
  arubaArchive,
  curacaoArchive,
  bonaireArchive,
  sabaArchive,
  sintEustatiusArchive,
  stPierreArchive,
  greenlandArchive,
  faroeArchive,
  alandArchive,
  gibraltarArchive,
  isleOfManArchive,
  jerseyArchive,
  guernseyArchive,
  alderneyArchive,
  sarkArchive,
  hermArchive,
  jethouArchive,
  brecqhouArchive,
  lihouArchive,
  burhouArchive,
  casquetsArchive,
  minquiersArchive,
  ecrehousArchive,
  pierresLecqArchive,
  dirouillesArchive,
  paternostersArchive,
} from "./national";

const nationalProviders = [
  ukWebArchive,
  stanfordArchive,
  nlaAustralia,
  nlnz,
  croatianArchive,
  czechArchive,
  estonianArchive,
  japaneseWarp,
  bibliothecaAlexandrina,
  archiveIt,
  danishArchive,
  norwegianArchive,
  swedishArchive,
  finnishArchive,
  germanArchive,
  frenchArchive,
  spanishArchive,
  italianArchive,
  belgianArchive,
  swissArchive,
  austrianArchive,
  irishArchive,
  greekArchive,
  turkishArchive,
  russianArchive,
  chineseArchive,
  koreanArchive,
  indianArchive,
  canadianArchive,
  mexicanArchive,
  brazilianArchive,
  argentineArchive,
  chileanArchive,
  colombianArchive,
  peruvianArchive,
  venezuelanArchive,
  ecuadorianArchive,
  bolivianArchive,
  paraguayanArchive,
  uruguayanArchive,
  costaRicanArchive,
  panamanianArchive,
  cubanArchive,
  dominicanArchive,
  puertoRicanArchive,
  jamaicanArchive,
  trinidadArchive,
  barbadosArchive,
  bahamasArchive,
  bermudaArchive,
  caymanArchive,
  turksCaicosArchive,
  bviArchive,
  anguillaArchive,
  montserratArchive,
  guadeloupeArchive,
  martiniqueArchive,
  stBarthelemyArchive,
  stMartinArchive,
  sintMaartenArchive,
  stKittsArchive,
  antiguaArchive,
  dominicaArchive,
  stLuciaArchive,
  stVincentArchive,
  grenadaArchive,
  arubaArchive,
  curacaoArchive,
  bonaireArchive,
  sabaArchive,
  sintEustatiusArchive,
  stPierreArchive,
  greenlandArchive,
  faroeArchive,
  alandArchive,
  gibraltarArchive,
  isleOfManArchive,
  jerseyArchive,
  guernseyArchive,
  alderneyArchive,
  sarkArchive,
  hermArchive,
  jethouArchive,
  brecqhouArchive,
  lihouArchive,
  burhouArchive,
  casquetsArchive,
  minquiersArchive,
  ecrehousArchive,
  pierresLecqArchive,
  dirouillesArchive,
  paternostersArchive,
];

export const providers: ArchiveProvider[] = [
  waybackProvider,
  arquivoProvider,
  commonCrawlProvider,
  icelandProvider,
  ...nationalProviders,
];

export function getProvider(id: string | null): ArchiveProvider {
  return providers.find((p) => p.id === id) ?? waybackProvider;
}

const CONCURRENCY = 20;

const primaryProviders = providers.slice(0, 4);

async function fetchProviders(
  providerList: ArchiveProvider[],
  url: string,
  opts?: { from?: string; to?: string; limit?: number },
): Promise<ProviderResult[]> {
  const results: ProviderResult[] = [];
  for (let i = 0; i < providerList.length; i += CONCURRENCY) {
    const batch = providerList.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(
      batch.map(async (provider) => {
        try {
          const captures = await provider.fetchCaptures(url, opts);
          return { provider, captures };
        } catch (error) {
          return {
            provider,
            captures: [],
            error: error instanceof Error ? error.message : String(error),
          };
        }
      }),
    );
    results.push(...batchResults);
  }
  return results;
}

export async function fetchFromAllProviders(
  url: string,
  opts?: { from?: string; to?: string; limit?: number },
): Promise<ProviderResult[]> {
  const primaryResults = await fetchProviders(primaryProviders, url, opts);
  const primaryResponded = primaryResults.filter((r) => !r.error && r.captures.length > 0);
  if (primaryResponded.length > 0) {
    return primaryResults;
  }
  const nationalResults = await fetchProviders(nationalProviders, url, opts);
  return [...primaryResults, ...nationalResults];
}

const PRIORITY = [
  "wayback",
  "arquivo",
  "commoncrawl",
  "iceland",
  ...nationalProviders.map((p) => p.id),
];

export function mergeCaptures(results: ProviderResult[]): ProviderCapture[] {
  const seen = new Set<string>();
  const merged: ProviderCapture[] = [];
  const sorted = [...results].sort(
    (a, b) => PRIORITY.indexOf(a.provider.id) - PRIORITY.indexOf(b.provider.id),
  );
  for (const result of sorted) {
    for (const capture of result.captures) {
      if (!seen.has(capture.timestamp)) {
        seen.add(capture.timestamp);
        merged.push(capture);
      }
    }
  }
  return merged.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}
