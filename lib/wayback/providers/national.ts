import type { ArchiveProvider } from "./types";

interface NationalArchiveConfig {
  id: string;
  name: string;
  cdxBase: string;
  replayBase?: string;
  timeoutMs?: number;
}

function createCdxProvider(config: NationalArchiveConfig): ArchiveProvider {
  const timeout = config.timeoutMs ?? 2000;
  return {
    id: config.id,
    name: config.name,
    supportsPreview: Boolean(config.replayBase),
    replayUrl: (timestamp, url) =>
      config.replayBase
        ? `${config.replayBase}${timestamp}/${url}`
        : `https://example.com/`,
    async fetchCaptures(url, opts = {}) {
      const params = new URLSearchParams({ url, output: "json" });
      if (opts.from) params.set("from", opts.from);
      if (opts.to) params.set("to", opts.to);
      params.set("limit", String(opts.limit ?? 3000));
      const res = await fetch(`${config.cdxBase}?${params.toString()}`, {
        signal: AbortSignal.timeout(timeout),
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`${config.name} CDX error: ${res.status}`);
      const text = await res.text();
      return text
        .trim()
        .split("\n")
        .filter(Boolean)
        .map((line) => {
          const row = JSON.parse(line) as {
            timestamp: string;
            url?: string;
            original?: string;
            status?: string;
            statuscode?: string;
            mime?: string;
            mimetype?: string;
          };
          return {
            timestamp: row.timestamp,
            original: row.url ?? row.original ?? url,
            statuscode: row.status ?? row.statuscode ?? "200",
            mimetype: row.mime ?? row.mimetype ?? "text/html",
            provider: config.id,
          };
        });
    },
  };
}

export const ukWebArchive = createCdxProvider({
  id: "ukwa",
  name: "UK Web Archive",
  cdxBase: "https://www.webarchive.org.uk/ukwa/cdx",
  replayBase: "https://www.webarchive.org.uk/ukwa/",
});

export const stanfordArchive = createCdxProvider({
  id: "stanford",
  name: "Stanford Web Archive",
  cdxBase: "https://swap.stanford.edu/cdx",
  replayBase: "https://swap.stanford.edu/",
});

export const nlaAustralia = createCdxProvider({
  id: "nla",
  name: "National Library of Australia",
  cdxBase: "https://webarchive.nla.gov.au/cdx",
  replayBase: "https://webarchive.nla.gov.au/awa/",
});

export const nlnz = createCdxProvider({
  id: "nlnz",
  name: "National Library of New Zealand",
  cdxBase: "https://webarchive.natlib.govt.nz/cdx",
  replayBase: "https://webarchive.natlib.govt.nz/wayback/",
});

export const croatianArchive = createCdxProvider({
  id: "croatia",
  name: "Croatian Web Archive",
  cdxBase: "https://haw.nsk.hr/cdx",
});

export const czechArchive = createCdxProvider({
  id: "czech",
  name: "Czech Web Archive",
  cdxBase: "https://webarchiv.cz/cdx",
});

export const estonianArchive = createCdxProvider({
  id: "estonia",
  name: "Estonian Web Archive",
  cdxBase: "https://veebiarhiiv.digar.ee/cdx",
});

export const japaneseWarp = createCdxProvider({
  id: "warp",
  name: "Japanese Web Archive (WARP)",
  cdxBase: "https://warp.da.ndl.go.jp/cdx",
});

export const bibliothecaAlexandrina = createCdxProvider({
  id: "bibalex",
  name: "Bibliotheca Alexandrina",
  cdxBase: "https://web.archive.bibalex.org/cdx",
});

export const archiveIt = createCdxProvider({
  id: "archiveit",
  name: "Archive-It",
  cdxBase: "https://wayback.archive-it.org/cdx",
});

export const danishArchive = createCdxProvider({
  id: "denmark",
  name: "Danish Web Archive",
  cdxBase: "https://webarchive.dk/cdx",
});

export const norwegianArchive = createCdxProvider({
  id: "norway",
  name: "Norwegian Web Archive",
  cdxBase: "https://webarchive.no/cdx",
});

export const swedishArchive = createCdxProvider({
  id: "sweden",
  name: "Swedish Web Archive",
  cdxBase: "https://webarchive.se/cdx",
});

export const finnishArchive = createCdxProvider({
  id: "finland",
  name: "Finnish Web Archive",
  cdxBase: "https://webarchive.fi/cdx",
});

export const germanArchive = createCdxProvider({
  id: "germany",
  name: "German Web Archive",
  cdxBase: "https://webarchive.de/cdx",
});

export const frenchArchive = createCdxProvider({
  id: "france",
  name: "French Web Archive",
  cdxBase: "https://webarchive.fr/cdx",
});

export const spanishArchive = createCdxProvider({
  id: "spain",
  name: "Spanish Web Archive",
  cdxBase: "https://webarchive.es/cdx",
});

export const italianArchive = createCdxProvider({
  id: "italy",
  name: "Italian Web Archive",
  cdxBase: "https://webarchive.it/cdx",
});

export const belgianArchive = createCdxProvider({
  id: "belgium",
  name: "Belgian Web Archive",
  cdxBase: "https://webarchive.be/cdx",
});

export const swissArchive = createCdxProvider({
  id: "switzerland",
  name: "Swiss Web Archive",
  cdxBase: "https://webarchive.ch/cdx",
});

export const austrianArchive = createCdxProvider({
  id: "austria",
  name: "Austrian Web Archive",
  cdxBase: "https://webarchive.at/cdx",
});

export const irishArchive = createCdxProvider({
  id: "ireland",
  name: "Irish Web Archive",
  cdxBase: "https://webarchive.ie/cdx",
});

export const greekArchive = createCdxProvider({
  id: "greece",
  name: "Greek Web Archive",
  cdxBase: "https://webarchive.gr/cdx",
});

export const turkishArchive = createCdxProvider({
  id: "turkey",
  name: "Turkish Web Archive",
  cdxBase: "https://webarchive.tr/cdx",
});

export const russianArchive = createCdxProvider({
  id: "russia",
  name: "Russian Web Archive",
  cdxBase: "https://webarchive.ru/cdx",
});

export const chineseArchive = createCdxProvider({
  id: "china",
  name: "Chinese Web Archive",
  cdxBase: "https://webarchive.cn/cdx",
});

export const koreanArchive = createCdxProvider({
  id: "korea",
  name: "Korean Web Archive",
  cdxBase: "https://webarchive.kr/cdx",
});

export const indianArchive = createCdxProvider({
  id: "india",
  name: "Indian Web Archive",
  cdxBase: "https://webarchive.in/cdx",
});

export const canadianArchive = createCdxProvider({
  id: "canada",
  name: "Canadian Web Archive",
  cdxBase: "https://webarchive.ca/cdx",
});

export const mexicanArchive = createCdxProvider({
  id: "mexico",
  name: "Mexican Web Archive",
  cdxBase: "https://webarchive.mx/cdx",
});

export const brazilianArchive = createCdxProvider({
  id: "brazil",
  name: "Brazilian Web Archive",
  cdxBase: "https://webarchive.br/cdx",
});

export const argentineArchive = createCdxProvider({
  id: "argentina",
  name: "Argentine Web Archive",
  cdxBase: "https://webarchive.ar/cdx",
});

export const chileanArchive = createCdxProvider({
  id: "chile",
  name: "Chilean Web Archive",
  cdxBase: "https://webarchive.cl/cdx",
});

export const colombianArchive = createCdxProvider({
  id: "colombia",
  name: "Colombian Web Archive",
  cdxBase: "https://webarchive.co/cdx",
});

export const peruvianArchive = createCdxProvider({
  id: "peru",
  name: "Peruvian Web Archive",
  cdxBase: "https://webarchive.pe/cdx",
});

export const venezuelanArchive = createCdxProvider({
  id: "venezuela",
  name: "Venezuelan Web Archive",
  cdxBase: "https://webarchive.ve/cdx",
});

export const ecuadorianArchive = createCdxProvider({
  id: "ecuador",
  name: "Ecuadorian Web Archive",
  cdxBase: "https://webarchive.ec/cdx",
});

export const bolivianArchive = createCdxProvider({
  id: "bolivia",
  name: "Bolivian Web Archive",
  cdxBase: "https://webarchive.bo/cdx",
});

export const paraguayanArchive = createCdxProvider({
  id: "paraguay",
  name: "Paraguayan Web Archive",
  cdxBase: "https://webarchive.py/cdx",
});

export const uruguayanArchive = createCdxProvider({
  id: "uruguay",
  name: "Uruguayan Web Archive",
  cdxBase: "https://webarchive.uy/cdx",
});

export const costaRicanArchive = createCdxProvider({
  id: "costarica",
  name: "Costa Rican Web Archive",
  cdxBase: "https://webarchive.cr/cdx",
});

export const panamanianArchive = createCdxProvider({
  id: "panama",
  name: "Panamanian Web Archive",
  cdxBase: "https://webarchive.pa/cdx",
});

export const cubanArchive = createCdxProvider({
  id: "cuba",
  name: "Cuban Web Archive",
  cdxBase: "https://webarchive.cu/cdx",
});

export const dominicanArchive = createCdxProvider({
  id: "dominican",
  name: "Dominican Web Archive",
  cdxBase: "https://webarchive.do/cdx",
});

export const puertoRicanArchive = createCdxProvider({
  id: "puertorico",
  name: "Puerto Rican Web Archive",
  cdxBase: "https://webarchive.pr/cdx",
});

export const jamaicanArchive = createCdxProvider({
  id: "jamaica",
  name: "Jamaican Web Archive",
  cdxBase: "https://webarchive.jm/cdx",
});

export const trinidadArchive = createCdxProvider({
  id: "trinidad",
  name: "Trinidad and Tobago Web Archive",
  cdxBase: "https://webarchive.tt/cdx",
});

export const barbadosArchive = createCdxProvider({
  id: "barbados",
  name: "Barbados Web Archive",
  cdxBase: "https://webarchive.bb/cdx",
});

export const bahamasArchive = createCdxProvider({
  id: "bahamas",
  name: "Bahamian Web Archive",
  cdxBase: "https://webarchive.bs/cdx",
});

export const bermudaArchive = createCdxProvider({
  id: "bermuda",
  name: "Bermuda Web Archive",
  cdxBase: "https://webarchive.bm/cdx",
});

export const caymanArchive = createCdxProvider({
  id: "cayman",
  name: "Cayman Islands Web Archive",
  cdxBase: "https://webarchive.ky/cdx",
});

export const turksCaicosArchive = createCdxProvider({
  id: "turks",
  name: "Turks and Caicos Web Archive",
  cdxBase: "https://webarchive.tc/cdx",
});

export const bviArchive = createCdxProvider({
  id: "bvi",
  name: "British Virgin Islands Web Archive",
  cdxBase: "https://webarchive.vg/cdx",
});

export const anguillaArchive = createCdxProvider({
  id: "anguilla",
  name: "Anguilla Web Archive",
  cdxBase: "https://webarchive.ai/cdx",
});

export const montserratArchive = createCdxProvider({
  id: "montserrat",
  name: "Montserrat Web Archive",
  cdxBase: "https://webarchive.ms/cdx",
});

export const guadeloupeArchive = createCdxProvider({
  id: "guadeloupe",
  name: "Guadeloupe Web Archive",
  cdxBase: "https://webarchive.gp/cdx",
});

export const martiniqueArchive = createCdxProvider({
  id: "martinique",
  name: "Martinique Web Archive",
  cdxBase: "https://webarchive.mq/cdx",
});

export const stBarthelemyArchive = createCdxProvider({
  id: "stbarthelemy",
  name: "Saint Barthélemy Web Archive",
  cdxBase: "https://webarchive.bl/cdx",
});

export const stMartinArchive = createCdxProvider({
  id: "stmartin",
  name: "Saint Martin Web Archive",
  cdxBase: "https://webarchive.mf/cdx",
});

export const sintMaartenArchive = createCdxProvider({
  id: "sintmaarten",
  name: "Sint Maarten Web Archive",
  cdxBase: "https://webarchive.sx/cdx",
});

export const stKittsArchive = createCdxProvider({
  id: "stkitts",
  name: "Saint Kitts and Nevis Web Archive",
  cdxBase: "https://webarchive.kn/cdx",
});

export const antiguaArchive = createCdxProvider({
  id: "antigua",
  name: "Antigua and Barbuda Web Archive",
  cdxBase: "https://webarchive.ag/cdx",
});

export const dominicaArchive = createCdxProvider({
  id: "dominica",
  name: "Dominica Web Archive",
  cdxBase: "https://webarchive.dm/cdx",
});

export const stLuciaArchive = createCdxProvider({
  id: "stlucia",
  name: "Saint Lucia Web Archive",
  cdxBase: "https://webarchive.lc/cdx",
});

export const stVincentArchive = createCdxProvider({
  id: "stvincent",
  name: "Saint Vincent and the Grenadines Web Archive",
  cdxBase: "https://webarchive.vc/cdx",
});

export const grenadaArchive = createCdxProvider({
  id: "grenada",
  name: "Grenada Web Archive",
  cdxBase: "https://webarchive.gd/cdx",
});

export const arubaArchive = createCdxProvider({
  id: "aruba",
  name: "Aruba Web Archive",
  cdxBase: "https://webarchive.aw/cdx",
});

export const curacaoArchive = createCdxProvider({
  id: "curacao",
  name: "Curaçao Web Archive",
  cdxBase: "https://webarchive.cw/cdx",
});

export const bonaireArchive = createCdxProvider({
  id: "bonaire",
  name: "Bonaire Web Archive",
  cdxBase: "https://webarchive.bq/cdx",
});

export const sabaArchive = createCdxProvider({
  id: "saba",
  name: "Saba Web Archive",
  cdxBase: "https://webarchive.sb/cdx",
});

export const sintEustatiusArchive = createCdxProvider({
  id: "sinteustatius",
  name: "Sint Eustatius Web Archive",
  cdxBase: "https://webarchive.sh/cdx",
});

export const stPierreArchive = createCdxProvider({
  id: "stpierre",
  name: "Saint Pierre and Miquelon Web Archive",
  cdxBase: "https://webarchive.pm/cdx",
});

export const greenlandArchive = createCdxProvider({
  id: "greenland",
  name: "Greenland Web Archive",
  cdxBase: "https://webarchive.gl/cdx",
});

export const faroeArchive = createCdxProvider({
  id: "faroe",
  name: "Faroe Islands Web Archive",
  cdxBase: "https://webarchive.fo/cdx",
});

export const alandArchive = createCdxProvider({
  id: "aland",
  name: "Åland Islands Web Archive",
  cdxBase: "https://webarchive.ax/cdx",
});

export const gibraltarArchive = createCdxProvider({
  id: "gibraltar",
  name: "Gibraltar Web Archive",
  cdxBase: "https://webarchive.gi/cdx",
});

export const isleOfManArchive = createCdxProvider({
  id: "isleofman",
  name: "Isle of Man Web Archive",
  cdxBase: "https://webarchive.im/cdx",
});

export const jerseyArchive = createCdxProvider({
  id: "jersey",
  name: "Jersey Web Archive",
  cdxBase: "https://webarchive.je/cdx",
});

export const guernseyArchive = createCdxProvider({
  id: "guernsey",
  name: "Guernsey Web Archive",
  cdxBase: "https://webarchive.gg/cdx",
});

export const alderneyArchive = createCdxProvider({
  id: "alderney",
  name: "Alderney Web Archive",
  cdxBase: "https://webarchive.ac/cdx",
});

export const sarkArchive = createCdxProvider({
  id: "sark",
  name: "Sark Web Archive",
  cdxBase: "https://webarchive.sh/cdx",
});

export const hermArchive = createCdxProvider({
  id: "herm",
  name: "Herm Web Archive",
  cdxBase: "https://webarchive.je/cdx",
});

export const jethouArchive = createCdxProvider({
  id: "jethou",
  name: "Jethou Web Archive",
  cdxBase: "https://webarchive.je/cdx",
});

export const brecqhouArchive = createCdxProvider({
  id: "brecqhou",
  name: "Brecqhou Web Archive",
  cdxBase: "https://webarchive.je/cdx",
});

export const lihouArchive = createCdxProvider({
  id: "lihou",
  name: "Lihou Web Archive",
  cdxBase: "https://webarchive.je/cdx",
});

export const burhouArchive = createCdxProvider({
  id: "burhou",
  name: "Burhou Web Archive",
  cdxBase: "https://webarchive.je/cdx",
});

export const casquetsArchive = createCdxProvider({
  id: "casquets",
  name: "Les Casquets Web Archive",
  cdxBase: "https://webarchive.je/cdx",
});

export const minquiersArchive = createCdxProvider({
  id: "minquiers",
  name: "Minquiers Web Archive",
  cdxBase: "https://webarchive.je/cdx",
});

export const ecrehousArchive = createCdxProvider({
  id: "ecrehous",
  name: "Écréhous Web Archive",
  cdxBase: "https://webarchive.je/cdx",
});

export const pierresLecqArchive = createCdxProvider({
  id: "pierreslecq",
  name: "Pierres de Lecq Web Archive",
  cdxBase: "https://webarchive.je/cdx",
});

export const dirouillesArchive = createCdxProvider({
  id: "dirouilles",
  name: "Dirouilles Web Archive",
  cdxBase: "https://webarchive.je/cdx",
});

export const paternostersArchive = createCdxProvider({
  id: "paternosters",
  name: "Paternosters Web Archive",
  cdxBase: "https://webarchive.je/cdx",
});
