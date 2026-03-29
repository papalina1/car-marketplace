"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  brands: string[];
  fuels: string[];
  modelsByBrand: Record<string, string[]>;
}

const KM_OPTIONS = [
  { value: "10000",  label: "10,000 km" },
  { value: "20000",  label: "20,000 km" },
  { value: "30000",  label: "30,000 km" },
  { value: "50000",  label: "50,000 km" },
  { value: "75000",  label: "75,000 km" },
  { value: "100000", label: "100,000 km" },
  { value: "150000", label: "150,000 km" },
  { value: "200000", label: "200,000 km" },
  { value: "250000", label: "250,000 km" },
  { value: "300000", label: "300,000 km" },
];

const YEARS = ["2015","2016","2017","2018","2019","2020","2021","2022","2023","2024","2025"];

const FEATURED_BRANDS = [
  { name: "Audi",          logo: "https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/thumb/audi.png" },
  { name: "BMW",           logo: "https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/thumb/bmw.png" },
  { name: "Volkswagen",    logo: "https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/thumb/volkswagen.png" },
  { name: "Mercedes-Benz", logo: "https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/thumb/mercedes-benz.png" },
  { name: "Porsche",       logo: "https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/thumb/porsche.png" },
  { name: "Land Rover",    logo: "https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/thumb/land-rover.png" },
  { name: "Toyota",        logo: "https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/thumb/toyota.png" },
  { name: "Hyundai",       logo: "https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/thumb/hyundai.png" },
  { name: "Kia",           logo: "https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/thumb/kia.png" },
  { name: "Genesis",       logo: "https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/thumb/genesis.png" },
];

const STEPS = [
  { num: "01", title: "Gjeni Veturën",           desc: "Zgjedhni veturën tuaj në katalog." },
  { num: "02", title: "Na Kontaktoni",            desc: "Telefon (+383 49 528 990) ose rrjete sociale." },
  { num: "03", title: "Inspektimi",               desc: "Inspektim profesional në Kore." },
  { num: "04", title: "Marrëveshja & Garancioni", desc: "Garancione të shkruara për motor, kambio etj." },
  { num: "05", title: "Porosia",                  desc: "Pagesa e faturës përmes bankës." },
  { num: "06", title: "Dorëzimi",                 desc: "Sipas marrëveshjes me klientin." },
];

const NAV_LINKS = [
  { label: "BALLINA",             href: "/" },
  { label: "STOKU",               href: "/stock" },
  { label: "PROCEDURA E BLERJES", href: "#procedura" },
  { label: "RRETH NESH",          href: "#rreth" },
  { label: "KONTAKT",             href: "#kontakt" },
];

const selectStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #d9d9d9",
  borderRadius: "4px",
  padding: "8px 28px 8px 10px",
  fontSize: "13px",
  color: "#333",
  backgroundColor: "#fff",
  outline: "none",
  cursor: "pointer",
  appearance: "none",
  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%23999' d='M5 7L0 2h10z'/%3E%3C/svg%3E\")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 9px center",
};

export default function HomeClient({ brands, fuels, modelsByBrand }: Props) {
  const router = useRouter();
  const [brand, setBrand]       = useState("");
  const [model, setModel]       = useState("");
  const [fuel, setFuel]         = useState("");
  const [yearFrom, setYearFrom] = useState("");
  const [kmFrom, setKmFrom]     = useState("");
  const [kmTo, setKmTo]         = useState("");

  const models = brand ? (modelsByBrand[brand] || []) : [];

  function handleSearch() {
    const params = new URLSearchParams();
    if (brand)    params.set("brand",    brand);
    if (model)    params.set("model",    model);
    if (fuel)     params.set("fuel",     fuel);
    if (yearFrom) params.set("yearFrom", yearFrom);
    if (kmFrom)   params.set("kmFrom",   kmFrom);
    if (kmTo)     params.set("kmTo",     kmTo);
    router.push("/stock?" + params.toString());
  }

  return (
    <div className="min-h-screen bg-white" style={{ color: "#333" }}>

      {/* ── Header ─────────────────────────────────────── */}
      <header className="bg-white sticky top-0 z-50" style={{ borderBottom: "1px solid #f3f3f3" }}>

        {/* Top utility row */}
        <div style={{ borderBottom: "1px solid #f5f5f5" }}>
          <div className="max-w-[1280px] mx-auto px-5 h-11 flex items-center justify-between">
            <a href="/" className="flex items-center gap-1">
              <span className="font-black text-xl tracking-tight" style={{ color: "#cc001e" }}>PREMIUM</span>
              <span className="font-black text-xl tracking-tight" style={{ color: "#181818" }}>CARS</span>
              <span className="text-xs ml-2 hidden sm:inline" style={{ color: "#aaa" }}>Korea Import</span>
            </a>
            <div className="flex items-center gap-5 text-xs" style={{ color: "#666" }}>
              <a href="https://www.facebook.com/p/Premium-Cars-Korea-61572215366411/" target="_blank" rel="noopener noreferrer" style={{ transition: "color .15s" }} onMouseEnter={e => (e.currentTarget.style.color = "#cc001e")} onMouseLeave={e => (e.currentTarget.style.color = "#666")}>Facebook</a>
              <a href="https://www.instagram.com/premiumcars_korea/" target="_blank" rel="noopener noreferrer" style={{ transition: "color .15s" }} onMouseEnter={e => (e.currentTarget.style.color = "#cc001e")} onMouseLeave={e => (e.currentTarget.style.color = "#666")}>Instagram</a>
              <a href="https://www.tiktok.com/@premiumcars.korea" target="_blank" rel="noopener noreferrer" style={{ transition: "color .15s" }} onMouseEnter={e => (e.currentTarget.style.color = "#cc001e")} onMouseLeave={e => (e.currentTarget.style.color = "#666")}>TikTok</a>
              <span style={{ color: "#d9d9d9" }}>|</span>
              <a href="tel:+38348800006" className="font-semibold" style={{ color: "#cc001e" }}>+383 48 800 006</a>
            </div>
          </div>
        </div>

        {/* Main nav */}
        <div className="max-w-[1280px] mx-auto px-5">
          <nav className="flex items-center gap-1">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="block text-sm font-medium"
                style={{
                  color: "#555",
                  padding: "14px 12px",
                  borderRadius: "6px",
                  letterSpacing: "-0.2px",
                  transition: "color .15s, background .15s",
                  textDecoration: "none",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = "#cc001e";
                  e.currentTarget.style.backgroundColor = "#fff5f5";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = "#555";
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* ── Search Banner ──────────────────────────────── */}
      <section style={{ backgroundColor: "#f5f5f5", padding: "32px 0 40px" }}>
        <div className="max-w-[1280px] mx-auto px-5">

          {/* Title */}
          <div className="mb-5">
            <h1 className="text-2xl font-bold" style={{ color: "#181818", letterSpacing: "-0.5px" }}>
              Gjeni veturën tuaj të importit
            </h1>
            <p className="text-sm mt-1" style={{ color: "#888" }}>Importim direkt nga Korea e Jugut — 2 muaj garancion</p>
          </div>

          {/* Search card */}
          <div className="bg-white" style={{ border: "1px solid #e9e9e9", borderRadius: "8px", padding: "0" }}>

            {/* Tab strip */}
            <div style={{ borderBottom: "1px solid #e9e9e9", padding: "0 20px" }}>
              <div className="flex">
                <span
                  className="text-sm font-semibold"
                  style={{
                    display: "inline-block",
                    padding: "14px 20px",
                    color: "#cc001e",
                    borderBottom: "2px solid #cc001e",
                    marginBottom: "-1px",
                    cursor: "default",
                  }}
                >
                  Vetura Importi
                </span>
              </div>
            </div>

            {/* Filters */}
            <div style={{ padding: "20px" }}>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "#666" }}>Marka</label>
                  <select
                    value={brand}
                    onChange={(e) => { setBrand(e.target.value); setModel(""); }}
                    style={selectStyle}
                  >
                    <option value="">Zgjidh marken</option>
                    {brands.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "#666" }}>Modeli</label>
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    disabled={models.length === 0}
                    style={{ ...selectStyle, color: models.length === 0 ? "#bbb" : "#333" }}
                  >
                    <option value="">Zgjidh modelin</option>
                    {models.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "#666" }}>Karburanti</label>
                  <select value={fuel} onChange={(e) => setFuel(e.target.value)} style={selectStyle}>
                    <option value="">Karburanti</option>
                    {fuels.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "#666" }}>Viti nga</label>
                  <select value={yearFrom} onChange={(e) => setYearFrom(e.target.value)} style={selectStyle}>
                    <option value="">Viti nga</option>
                    {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "#666" }}>KM nga</label>
                  <select value={kmFrom} onChange={(e) => setKmFrom(e.target.value)} style={selectStyle}>
                    <option value="">KM nga</option>
                    {KM_OPTIONS.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "#666" }}>KM deri</label>
                  <select value={kmTo} onChange={(e) => setKmTo(e.target.value)} style={selectStyle}>
                    <option value="">KM deri</option>
                    {KM_OPTIONS.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={handleSearch}
                  className="text-white font-semibold text-sm"
                  style={{
                    backgroundColor: "#cc001e",
                    border: "none",
                    borderRadius: "4px",
                    padding: "10px 28px",
                    cursor: "pointer",
                    transition: "background .15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#a0001a")}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#cc001e")}
                >
                  Kerko Veturën
                </button>
                <a
                  href="/stock"
                  className="text-sm font-medium"
                  style={{
                    color: "#555",
                    border: "1px solid #d9d9d9",
                    borderRadius: "4px",
                    padding: "9px 20px",
                    textDecoration: "none",
                    transition: "border-color .15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "#999")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "#d9d9d9")}
                >
                  Shiko të gjitha →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Brand Section ──────────────────────────────── */}
      <section style={{ backgroundColor: "#fff", padding: "36px 0" }}>
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold" style={{ color: "#181818" }}>Veturat në Stok</h2>
            <a href="/stock" className="text-xs font-medium" style={{ color: "#cc001e", textDecoration: "none" }}>
              Shiko të gjitha →
            </a>
          </div>
          <div
            className="grid grid-cols-5 sm:grid-cols-10 gap-0"
            style={{ border: "1px solid #e9e9e9", borderRadius: "6px", overflow: "hidden" }}
          >
            {FEATURED_BRANDS.map((b, i) => (
              <button
                key={b.name}
                onClick={() => router.push("/stock?brand=" + encodeURIComponent(b.name))}
                className="flex flex-col items-center justify-center gap-2"
                style={{
                  padding: "18px 8px",
                  backgroundColor: "#fff",
                  border: "none",
                  borderRight: i % 10 !== 9 ? "1px solid #e9e9e9" : "none",
                  borderBottom: i < 5 ? "1px solid #e9e9e9" : "none",
                  cursor: "pointer",
                  transition: "background .15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#fff5f5")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#fff")}
              >
                <img src={b.logo} alt={b.name} style={{ height: "32px", width: "auto", objectFit: "contain" }} />
                <span className="text-xs" style={{ color: "#333", fontWeight: 500 }}>{b.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Procedura e Blerjes ────────────────────────── */}
      <section id="procedura" style={{ backgroundColor: "#f5f5f5", padding: "48px 0" }}>
        <div className="max-w-[1280px] mx-auto px-5">
          <h2 className="text-lg font-bold mb-8" style={{ color: "#181818" }}>Procedura e Blerjes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {STEPS.map((step) => (
              <div
                key={step.num}
                className="bg-white"
                style={{ border: "1px solid #e9e9e9", borderRadius: "6px", padding: "20px 22px" }}
              >
                <div
                  className="text-xs font-bold mb-3"
                  style={{ color: "#cc001e", letterSpacing: "0.5px" }}
                >
                  {step.num}
                </div>
                <h3 className="font-bold text-sm mb-1.5" style={{ color: "#181818" }}>{step.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "#888" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Rreth Nesh ─────────────────────────────────── */}
      <section id="rreth" style={{ backgroundColor: "#fff", padding: "48px 0" }}>
        <div className="max-w-[800px] mx-auto px-5 text-center">
          <h2 className="text-lg font-bold mb-4" style={{ color: "#181818" }}>Rreth Nesh</h2>
          <p className="text-sm leading-relaxed mb-3" style={{ color: "#555" }}>
            Premium Cars Korea është kompani e specializuar në importimin e veturave të përzgjedhura nga Korea e Jugut për tregjet e Kosovës dhe Shqipërisë. Ne besojmë se çdo klient meriton një veturë në gjendje të shkëlqyer — prandaj procesi ynë fillon me inspektime profesionale dhe të detajuara në vend, të kryera nga ekipet profesionale në Kore.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#555" }}>
            Ne dallojmë për transparencë, korrektësi dhe çmime konkurruese — synimi ynë është të ofrojmë veturën më të mirë me çmimin më të mirë.
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <div className="text-center" style={{ padding: "16px 24px", border: "1px solid #e9e9e9", borderRadius: "6px", minWidth: "120px" }}>
              <div className="text-2xl font-black" style={{ color: "#cc001e" }}>2+</div>
              <div className="text-xs mt-1" style={{ color: "#888" }}>Vite eksperiencë</div>
            </div>
            <div className="text-center" style={{ padding: "16px 24px", border: "1px solid #e9e9e9", borderRadius: "6px", minWidth: "120px" }}>
              <div className="text-2xl font-black" style={{ color: "#cc001e" }}>100+</div>
              <div className="text-xs mt-1" style={{ color: "#888" }}>Vetura të shitura</div>
            </div>
            <div className="text-center" style={{ padding: "16px 24px", border: "1px solid #e9e9e9", borderRadius: "6px", minWidth: "120px" }}>
              <div className="text-2xl font-black" style={{ color: "#cc001e" }}>2 muaj</div>
              <div className="text-xs mt-1" style={{ color: "#888" }}>Garancion</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer id="kontakt" style={{ backgroundColor: "#1a1a1a", padding: "48px 0 24px" }}>
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 pb-8" style={{ borderBottom: "1px solid #333" }}>
            <div>
              <div className="font-black text-lg mb-3">
                <span style={{ color: "#cc001e" }}>PREMIUM</span>
                <span style={{ color: "#fff" }}>CARS</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "#777" }}>
                Importim direkt nga Korea e Jugut<br />për tregjet e Kosovës dhe Shqipërisë.
              </p>
              <div className="flex gap-3 mt-4">
                <a href="https://www.facebook.com/p/Premium-Cars-Korea-61572215366411/" target="_blank" rel="noopener noreferrer" className="text-xs" style={{ color: "#777", textDecoration: "none", transition: "color .15s" }} onMouseEnter={e => (e.currentTarget.style.color = "#fff")} onMouseLeave={e => (e.currentTarget.style.color = "#777")}>Facebook</a>
                <a href="https://www.instagram.com/premiumcars_korea/" target="_blank" rel="noopener noreferrer" className="text-xs" style={{ color: "#777", textDecoration: "none", transition: "color .15s" }} onMouseEnter={e => (e.currentTarget.style.color = "#fff")} onMouseLeave={e => (e.currentTarget.style.color = "#777")}>Instagram</a>
                <a href="https://www.tiktok.com/@premiumcars.korea" target="_blank" rel="noopener noreferrer" className="text-xs" style={{ color: "#777", textDecoration: "none", transition: "color .15s" }} onMouseEnter={e => (e.currentTarget.style.color = "#fff")} onMouseLeave={e => (e.currentTarget.style.color = "#777")}>TikTok</a>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#aaa" }}>Kontakt</p>
              <div className="space-y-2 text-sm" style={{ color: "#777" }}>
                <p><a href="tel:+38348800006" style={{ color: "#777", textDecoration: "none" }}>+383 48 800 006</a></p>
                <p><a href="tel:+38349528990" style={{ color: "#777", textDecoration: "none" }}>+383 49 528 990</a></p>
                <p style={{ color: "#777" }}>Fushë Kosovë, Rr. Nënë Tereza</p>
                <p style={{ color: "#777" }}>premiumcars_korea</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#aaa" }}>Linqet</p>
              <div className="space-y-2">
                <a href="/" className="block text-sm" style={{ color: "#777", textDecoration: "none", transition: "color .15s" }} onMouseEnter={e => (e.currentTarget.style.color = "#fff")} onMouseLeave={e => (e.currentTarget.style.color = "#777")}>Ballina</a>
                <a href="/stock" className="block text-sm" style={{ color: "#777", textDecoration: "none", transition: "color .15s" }} onMouseEnter={e => (e.currentTarget.style.color = "#fff")} onMouseLeave={e => (e.currentTarget.style.color = "#777")}>Stoku</a>
                <a href="#procedura" className="block text-sm" style={{ color: "#777", textDecoration: "none", transition: "color .15s" }} onMouseEnter={e => (e.currentTarget.style.color = "#fff")} onMouseLeave={e => (e.currentTarget.style.color = "#777")}>Procedura e Blerjes</a>
                <a href="#rreth" className="block text-sm" style={{ color: "#777", textDecoration: "none", transition: "color .15s" }} onMouseEnter={e => (e.currentTarget.style.color = "#fff")} onMouseLeave={e => (e.currentTarget.style.color = "#777")}>Rreth Nesh</a>
              </div>
            </div>
          </div>
          <div className="pt-5 text-xs text-center" style={{ color: "#555" }}>
            © {new Date().getFullYear()} PremiumCars Korea. Të gjitha të drejtat e rezervuara.
          </div>
        </div>
      </footer>

    </div>
  );
}
