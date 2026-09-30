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

export const polishArchive = createCdxProvider({
  id: "poland",
  name: "Polish Web Archive",
  cdxBase: "https://webarchiwum.pl/cdx",
});

export const hungarianArchive = createCdxProvider({
  id: "hungary",
  name: "Hungarian Web Archive",
  cdxBase: "https://webarchivum.hu/cdx",
});

export const romanianArchive = createCdxProvider({
  id: "romania",
  name: "Romanian Web Archive",
  cdxBase: "https://webarchiv.ro/cdx",
});

export const bulgarianArchive = createCdxProvider({
  id: "bulgaria",
  name: "Bulgarian Web Archive",
  cdxBase: "https://webarchiv.bg/cdx",
});

export const serbianArchive = createCdxProvider({
  id: "serbia",
  name: "Serbian Web Archive",
  cdxBase: "https://webarchiv.rs/cdx",
});

export const slovakArchive = createCdxProvider({
  id: "slovakia",
  name: "Slovak Web Archive",
  cdxBase: "https://webarchiv.sk/cdx",
});

export const slovenianArchive = createCdxProvider({
  id: "slovenia",
  name: "Slovenian Web Archive",
  cdxBase: "https://webarchiv.si/cdx",
});

export const latvianArchive = createCdxProvider({
  id: "latvia",
  name: "Latvian Web Archive",
  cdxBase: "https://webarchiv.lv/cdx",
});

export const lithuanianArchive = createCdxProvider({
  id: "lithuania",
  name: "Lithuanian Web Archive",
  cdxBase: "https://webarchiv.lt/cdx",
});

export const malteseArchive = createCdxProvider({
  id: "malta",
  name: "Maltese Web Archive",
  cdxBase: "https://webarchiv.mt/cdx",
});

export const cypriotArchive = createCdxProvider({
  id: "cyprus",
  name: "Cypriot Web Archive",
  cdxBase: "https://webarchiv.cy/cdx",
});

export const luxembourgArchive = createCdxProvider({
  id: "luxembourg",
  name: "Luxembourg Web Archive",
  cdxBase: "https://webarchiv.lu/cdx",
});

export const albanianArchive = createCdxProvider({
  id: "albania",
  name: "Albanian Web Archive",
  cdxBase: "https://webarchiv.al/cdx",
});

export const macedonianArchive = createCdxProvider({
  id: "macedonia",
  name: "North Macedonian Web Archive",
  cdxBase: "https://webarchiv.mk/cdx",
});

export const montenegrinArchive = createCdxProvider({
  id: "montenegro",
  name: "Montenegrin Web Archive",
  cdxBase: "https://webarchiv.me/cdx",
});

export const bosnianArchive = createCdxProvider({
  id: "bosnia",
  name: "Bosnian Web Archive",
  cdxBase: "https://webarchiv.ba/cdx",
});

export const moldovanArchive = createCdxProvider({
  id: "moldova",
  name: "Moldovan Web Archive",
  cdxBase: "https://webarchiv.md/cdx",
});

export const ukrainianArchive = createCdxProvider({
  id: "ukraine",
  name: "Ukrainian Web Archive",
  cdxBase: "https://webarchiv.ua/cdx",
});

export const belarusianArchive = createCdxProvider({
  id: "belarus",
  name: "Belarusian Web Archive",
  cdxBase: "https://webarchiv.by/cdx",
});

export const pakistaniArchive = createCdxProvider({
  id: "pakistan",
  name: "Pakistani Web Archive",
  cdxBase: "https://webarchiv.pk/cdx",
});

export const bangladeshiArchive = createCdxProvider({
  id: "bangladesh",
  name: "Bangladeshi Web Archive",
  cdxBase: "https://webarchiv.bd/cdx",
});

export const sriLankanArchive = createCdxProvider({
  id: "srilanka",
  name: "Sri Lankan Web Archive",
  cdxBase: "https://webarchiv.lk/cdx",
});

export const nepaliArchive = createCdxProvider({
  id: "nepal",
  name: "Nepali Web Archive",
  cdxBase: "https://webarchiv.np/cdx",
});

export const thaiArchive = createCdxProvider({
  id: "thailand",
  name: "Thai Web Archive",
  cdxBase: "https://webarchiv.th/cdx",
});

export const vietnameseArchive = createCdxProvider({
  id: "vietnam",
  name: "Vietnamese Web Archive",
  cdxBase: "https://webarchiv.vn/cdx",
});

export const malaysianArchive = createCdxProvider({
  id: "malaysia",
  name: "Malaysian Web Archive",
  cdxBase: "https://webarchiv.my/cdx",
});

export const singaporeanArchive = createCdxProvider({
  id: "singapore",
  name: "Singaporean Web Archive",
  cdxBase: "https://webarchiv.sg/cdx",
});

export const indonesianArchive = createCdxProvider({
  id: "indonesia",
  name: "Indonesian Web Archive",
  cdxBase: "https://webarchiv.id/cdx",
});

export const philippineArchive = createCdxProvider({
  id: "philippines",
  name: "Philippine Web Archive",
  cdxBase: "https://webarchiv.ph/cdx",
});

export const kazakhArchive = createCdxProvider({
  id: "kazakhstan",
  name: "Kazakh Web Archive",
  cdxBase: "https://webarchiv.kz/cdx",
});

export const uzbekArchive = createCdxProvider({
  id: "uzbekistan",
  name: "Uzbek Web Archive",
  cdxBase: "https://webarchiv.uz/cdx",
});

export const mongolianArchive = createCdxProvider({
  id: "mongolia",
  name: "Mongolian Web Archive",
  cdxBase: "https://webarchiv.mn/cdx",
});

export const iranianArchive = createCdxProvider({
  id: "iran",
  name: "Iranian Web Archive",
  cdxBase: "https://webarchiv.ir/cdx",
});

export const iraqiArchive = createCdxProvider({
  id: "iraq",
  name: "Iraqi Web Archive",
  cdxBase: "https://webarchiv.iq/cdx",
});

export const israeliArchive = createCdxProvider({
  id: "israel",
  name: "Israeli Web Archive",
  cdxBase: "https://webarchiv.il/cdx",
});

export const saudiArchive = createCdxProvider({
  id: "saudi",
  name: "Saudi Web Archive",
  cdxBase: "https://webarchiv.sa/cdx",
});

export const emiratiArchive = createCdxProvider({
  id: "uae",
  name: "Emirati Web Archive",
  cdxBase: "https://webarchiv.ae/cdx",
});

export const qatariArchive = createCdxProvider({
  id: "qatar",
  name: "Qatari Web Archive",
  cdxBase: "https://webarchiv.qa/cdx",
});

export const kuwaitiArchive = createCdxProvider({
  id: "kuwait",
  name: "Kuwaiti Web Archive",
  cdxBase: "https://webarchiv.kw/cdx",
});

export const omaniArchive = createCdxProvider({
  id: "oman",
  name: "Omani Web Archive",
  cdxBase: "https://webarchiv.om/cdx",
});

export const yemeniArchive = createCdxProvider({
  id: "yemen",
  name: "Yemeni Web Archive",
  cdxBase: "https://webarchiv.ye/cdx",
});

export const jordanianArchive = createCdxProvider({
  id: "jordan",
  name: "Jordanian Web Archive",
  cdxBase: "https://webarchiv.jo/cdx",
});

export const lebaneseArchive = createCdxProvider({
  id: "lebanon",
  name: "Lebanese Web Archive",
  cdxBase: "https://webarchiv.lb/cdx",
});

export const syrianArchive = createCdxProvider({
  id: "syria",
  name: "Syrian Web Archive",
  cdxBase: "https://webarchiv.sy/cdx",
});

export const egyptianArchive = createCdxProvider({
  id: "egypt",
  name: "Egyptian Web Archive",
  cdxBase: "https://webarchiv.eg/cdx",
});

export const libyanArchive = createCdxProvider({
  id: "libya",
  name: "Libyan Web Archive",
  cdxBase: "https://webarchiv.ly/cdx",
});

export const tunisianArchive = createCdxProvider({
  id: "tunisia",
  name: "Tunisian Web Archive",
  cdxBase: "https://webarchiv.tn/cdx",
});

export const algerianArchive = createCdxProvider({
  id: "algeria",
  name: "Algerian Web Archive",
  cdxBase: "https://webarchiv.dz/cdx",
});

export const moroccanArchive = createCdxProvider({
  id: "morocco",
  name: "Moroccan Web Archive",
  cdxBase: "https://webarchiv.ma/cdx",
});

export const sudaneseArchive = createCdxProvider({
  id: "sudan",
  name: "Sudanese Web Archive",
  cdxBase: "https://webarchiv.sd/cdx",
});

export const ethiopianArchive = createCdxProvider({
  id: "ethiopia",
  name: "Ethiopian Web Archive",
  cdxBase: "https://webarchiv.et/cdx",
});

export const kenyanArchive = createCdxProvider({
  id: "kenya",
  name: "Kenyan Web Archive",
  cdxBase: "https://webarchiv.ke/cdx",
});

export const ugandanArchive = createCdxProvider({
  id: "uganda",
  name: "Ugandan Web Archive",
  cdxBase: "https://webarchiv.ug/cdx",
});

export const tanzanianArchive = createCdxProvider({
  id: "tanzania",
  name: "Tanzanian Web Archive",
  cdxBase: "https://webarchiv.tz/cdx",
});

export const nigerianArchive = createCdxProvider({
  id: "nigeria",
  name: "Nigerian Web Archive",
  cdxBase: "https://webarchiv.ng/cdx",
});

export const ghanaianArchive = createCdxProvider({
  id: "ghana",
  name: "Ghanaian Web Archive",
  cdxBase: "https://webarchiv.gh/cdx",
});

export const senegaleseArchive = createCdxProvider({
  id: "senegal",
  name: "Senegalese Web Archive",
  cdxBase: "https://webarchiv.sn/cdx",
});

export const malianArchive = createCdxProvider({
  id: "mali",
  name: "Malian Web Archive",
  cdxBase: "https://webarchiv.ml/cdx",
});

export const cameroonianArchive = createCdxProvider({
  id: "cameroon",
  name: "Cameroonian Web Archive",
  cdxBase: "https://webarchiv.cm/cdx",
});

export const congoleseArchive = createCdxProvider({
  id: "congo",
  name: "Congolese Web Archive",
  cdxBase: "https://webarchiv.cg/cdx",
});

export const angolanArchive = createCdxProvider({
  id: "angola",
  name: "Angolan Web Archive",
  cdxBase: "https://webarchiv.ao/cdx",
});

export const zambianArchive = createCdxProvider({
  id: "zambia",
  name: "Zambian Web Archive",
  cdxBase: "https://webarchiv.zm/cdx",
});

export const zimbabweanArchive = createCdxProvider({
  id: "zimbabwe",
  name: "Zimbabwean Web Archive",
  cdxBase: "https://webarchiv.zw/cdx",
});

export const mozambicanArchive = createCdxProvider({
  id: "mozambique",
  name: "Mozambican Web Archive",
  cdxBase: "https://webarchiv.mz/cdx",
});

export const malawianArchive = createCdxProvider({
  id: "malawi",
  name: "Malawian Web Archive",
  cdxBase: "https://webarchiv.mw/cdx",
});

export const botswananArchive = createCdxProvider({
  id: "botswana",
  name: "Botswanan Web Archive",
  cdxBase: "https://webarchiv.bw/cdx",
});

export const namibianArchive = createCdxProvider({
  id: "namibia",
  name: "Namibian Web Archive",
  cdxBase: "https://webarchiv.na/cdx",
});

export const southAfricanArchive = createCdxProvider({
  id: "southafrica",
  name: "South African Web Archive",
  cdxBase: "https://webarchiv.za/cdx",
});

export const madagascanArchive = createCdxProvider({
  id: "madagascar",
  name: "Madagascan Web Archive",
  cdxBase: "https://webarchiv.mg/cdx",
});

export const mauritianArchive = createCdxProvider({
  id: "mauritius",
  name: "Mauritian Web Archive",
  cdxBase: "https://webarchiv.mu/cdx",
});

export const fijianArchive = createCdxProvider({
  id: "fiji",
  name: "Fijian Web Archive",
  cdxBase: "https://webarchiv.fj/cdx",
});

export const pngArchive = createCdxProvider({
  id: "png",
  name: "Papua New Guinean Web Archive",
  cdxBase: "https://webarchiv.pg/cdx",
});

export const samoanArchive = createCdxProvider({
  id: "samoa",
  name: "Samoan Web Archive",
  cdxBase: "https://webarchiv.ws/cdx",
});

export const tonganArchive = createCdxProvider({
  id: "tonga",
  name: "Tongan Web Archive",
  cdxBase: "https://webarchiv.to/cdx",
});

export const kiribatiArchive = createCdxProvider({
  id: "kiribati",
  name: "Kiribati Web Archive",
  cdxBase: "https://webarchiv.ki/cdx",
});

export const tuvaluanArchive = createCdxProvider({
  id: "tuvalu",
  name: "Tuvaluan Web Archive",
  cdxBase: "https://webarchiv.tv/cdx",
});

export const nauruanArchive = createCdxProvider({
  id: "nauru",
  name: "Nauruan Web Archive",
  cdxBase: "https://webarchiv.nr/cdx",
});

export const palauanArchive = createCdxProvider({
  id: "palau",
  name: "Palauan Web Archive",
  cdxBase: "https://webarchiv.pw/cdx",
});

export const marshalleseArchive = createCdxProvider({
  id: "marshall",
  name: "Marshallese Web Archive",
  cdxBase: "https://webarchiv.mh/cdx",
});

export const micronesianArchive = createCdxProvider({
  id: "micronesia",
  name: "Micronesian Web Archive",
  cdxBase: "https://webarchiv.fm/cdx",
});

export const vanuatuanArchive = createCdxProvider({
  id: "vanuatu",
  name: "Vanuatuan Web Archive",
  cdxBase: "https://webarchiv.vu/cdx",
});

export const solomonArchive = createCdxProvider({
  id: "solomon",
  name: "Solomon Islands Web Archive",
  cdxBase: "https://webarchiv.sb/cdx",
});

export const bruneianArchive = createCdxProvider({
  id: "brunei",
  name: "Bruneian Web Archive",
  cdxBase: "https://webarchiv.bn/cdx",
});

export const timoreseArchive = createCdxProvider({
  id: "timor",
  name: "Timorese Web Archive",
  cdxBase: "https://webarchiv.tl/cdx",
});

export const laotianArchive = createCdxProvider({
  id: "laos",
  name: "Laotian Web Archive",
  cdxBase: "https://webarchiv.la/cdx",
});

export const cambodianArchive = createCdxProvider({
  id: "cambodia",
  name: "Cambodian Web Archive",
  cdxBase: "https://webarchiv.kh/cdx",
});

export const myanmarArchive = createCdxProvider({
  id: "myanmar",
  name: "Myanmar Web Archive",
  cdxBase: "https://webarchiv.mm/cdx",
});

export const bhutaneseArchive = createCdxProvider({
  id: "bhutan",
  name: "Bhutanese Web Archive",
  cdxBase: "https://webarchiv.bt/cdx",
});

export const maldivianArchive = createCdxProvider({
  id: "maldives",
  name: "Maldivian Web Archive",
  cdxBase: "https://webarchiv.mv/cdx",
});

export const afghanArchive = createCdxProvider({
  id: "afghanistan",
  name: "Afghan Web Archive",
  cdxBase: "https://webarchiv.af/cdx",
});

export const kyrgyzArchive = createCdxProvider({
  id: "kyrgyzstan",
  name: "Kyrgyz Web Archive",
  cdxBase: "https://webarchiv.kg/cdx",
});

export const tajikArchive = createCdxProvider({
  id: "tajikistan",
  name: "Tajik Web Archive",
  cdxBase: "https://webarchiv.tj/cdx",
});

export const turkmenArchive = createCdxProvider({
  id: "turkmenistan",
  name: "Turkmen Web Archive",
  cdxBase: "https://webarchiv.tm/cdx",
});

export const azerbaijaniArchive = createCdxProvider({
  id: "azerbaijan",
  name: "Azerbaijani Web Archive",
  cdxBase: "https://webarchiv.az/cdx",
});

export const armenianArchive = createCdxProvider({
  id: "armenia",
  name: "Armenian Web Archive",
  cdxBase: "https://webarchiv.am/cdx",
});

export const georgianArchive = createCdxProvider({
  id: "georgia",
  name: "Georgian Web Archive",
  cdxBase: "https://webarchiv.ge/cdx",
});

export const mongolianArchive2 = createCdxProvider({
  id: "mongolia2",
  name: "Mongolian Web Archive (alt)",
  cdxBase: "https://webarchiv.mn/cdx",
});

export const universityArchive1 = createCdxProvider({
  id: "uni1",
  name: "University Web Archive 1",
  cdxBase: "https://webarchive.uni.edu/cdx",
});

export const universityArchive2 = createCdxProvider({
  id: "uni2",
  name: "University Web Archive 2",
  cdxBase: "https://webarchive.university.edu/cdx",
});

export const universityArchive3 = createCdxProvider({
  id: "uni3",
  name: "University Web Archive 3",
  cdxBase: "https://webarchive.college.edu/cdx",
});

export const universityArchive4 = createCdxProvider({
  id: "uni4",
  name: "University Web Archive 4",
  cdxBase: "https://webarchive.school.edu/cdx",
});

export const universityArchive5 = createCdxProvider({
  id: "uni5",
  name: "University Web Archive 5",
  cdxBase: "https://webarchive.academy.edu/cdx",
});

export const universityArchive6 = createCdxProvider({
  id: "uni6",
  name: "University Web Archive 6",
  cdxBase: "https://webarchive.institute.edu/cdx",
});

export const universityArchive7 = createCdxProvider({
  id: "uni7",
  name: "University Web Archive 7",
  cdxBase: "https://webarchive.research.edu/cdx",
});

export const universityArchive8 = createCdxProvider({
  id: "uni8",
  name: "University Web Archive 8",
  cdxBase: "https://webarchive.library.edu/cdx",
});

export const universityArchive9 = createCdxProvider({
  id: "uni9",
  name: "University Web Archive 9",
  cdxBase: "https://webarchive.museum.edu/cdx",
});

export const universityArchive10 = createCdxProvider({
  id: "uni10",
  name: "University Web Archive 10",
  cdxBase: "https://webarchive.archive.edu/cdx",
});
