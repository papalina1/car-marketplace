"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Car } from "@/lib/cars";
import { toEur } from "@/lib/utils";

interface Props {
  allCars: Car[];
}

type SortKey = "default" | "price_asc" | "price_desc" | "year_desc" | "km_asc";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "default",    label: "Renditja standarde" },
  { value: "price_asc",  label: "Çmimi: i ulët → i lartë" },
  { value: "price_desc", label: "Çmimi: i lartë → i ulët" },
  { value: "year_desc",  label: "Viti: më i ri" },
  { value: "km_asc",     label: "Kilometrazha: më e ulët" },
];

const NAV_LINKS = [
  { label: "BALLINA",             href: "/" },
  { label: "STOKU",               href: "/stock" },
  { label: "PROCEDURA E BLERJES", href: "/#procedura" },
  { label: "RRETH NESH",          href: "/#rreth" },
  { label: "KONTAKT",             href: "/#kontakt" },
];

const selectStyle: React.CSSProperties = {
  border: "1px solid #d9d9d9",
  borderRadius: "4px",
  padding: "7px 28px 7px 10px",
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

export default function StockClient({ allCars }: Props) {
  const searchParams = useSearchParams();
  const router       = useRouter();

  const brand    = searchParams.get("brand")    || "";
  const model    = searchParams.get("model")    || "";
  const fuel     = searchParams.get("fuel")     || "";
  const yearFrom = searchParams.get("yearFrom") || "";
  const kmFrom   = searchParams.get("kmFrom")   || "";
  const kmTo     = searchParams.get("kmTo")     || "";

  const [sort, setSort] = useState<SortKey>("default");
  const [filtered, setFiltered] = useState<Car[]>([]);

  useEffect(() => {
    let result = [...allCars];

    if (brand)    result = result.filter((c) => c.brand === brand);
    if (model)    result = result.filter((c) => c.model === model);
    if (fuel)     result = result.filter((c) => c.fuel  === fuel);

    if (yearFrom) {
      result = result.filter((c) => {
        const y = parseInt(c.year?.slice(0, 2) || "0", 10) + 2000;
        return y >= parseInt(yearFrom, 10);
      });
    }
    if (kmFrom) {
      result = result.filter((c) => {
        const km = parseInt(c.mileage?.replace(/[^0-9]/g, "") || "0", 10);
        return km >= parseInt(kmFrom, 10);
      });
    }
    if (kmTo) {
      result = result.filter((c) => {
        const km = parseInt(c.mileage?.replace(/[^0-9]/g, "") || "0", 10);
        return km <= parseInt(kmTo, 10);
      });
    }

    if (sort === "price_asc")  result.sort((a, b) => toEur(a.price) - toEur(b.price));
    if (sort === "price_desc") result.sort((a, b) => toEur(b.price) - toEur(a.price));
    if (sort === "year_desc")  result.sort((a, b) => (b.year || "").localeCompare(a.year || ""));
    if (sort === "km_asc")     result.sort((a, b) => {
      const ka = parseInt(a.mileage?.replace(/[^0-9]/g, "") || "0", 10);
      const kb = parseInt(b.mileage?.replace(/[^0-9]/g, "") || "0", 10);
      return ka - kb;
    });

    setFiltered(result);
  }, [allCars, brand, model, fuel, yearFrom, kmFrom, kmTo, sort]);

  const activeFilters = [
    brand    && { key: "brand",    label: brand },
    model    && { key: "model",    label: model },
    fuel     && { key: "fuel",     label: fuel },
    yearFrom && { key: "yearFrom", label: `Nga ${yearFrom}` },
    kmFrom   && { key: "kmFrom",   label: `KM ≥ ${Number(kmFrom).toLocaleString()}` },
    kmTo     && { key: "kmTo",     label: `KM ≤ ${Number(kmTo).toLocaleString()}` },
  ].filter(Boolean) as { key: string; label: string }[];

  function removeFilter(key: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    router.push("/stock?" + params.toString());
  }

  return (
    <div className="min-h-screen bg-white" style={{ color: "#333" }}>

      {/* ── Header ─────────────────────────────────────── */}
      <header className="bg-white sticky top-0 z-50" style={{ borderBottom: "1px solid #f3f3f3" }}>
        <div style={{ borderBottom: "1px solid #f5f5f5" }}>
          <div className="max-w-[1280px] mx-auto px-5 h-11 flex items-center justify-between">
            <a href="/" className="flex items-center gap-1">
              <span className="font-black text-xl tracking-tight" style={{ color: "#cc001e" }}>PREMIUM</span>
              <span className="font-black text-xl tracking-tight" style={{ color: "#181818" }}>CARS</span>
            </a>
            <a href="tel:+38348800006" className="text-xs font-semibold" style={{ color: "#cc001e", textDecoration: "none" }}>
              +383 44 552 412
            </a>
          </div>
        </div>
        <div className="max-w-[1280px] mx-auto px-5">
          <nav className="flex items-center gap-1">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="block text-sm font-medium"
                style={{
                  color: label === "STOKU" ? "#cc001e" : "#555",
                  padding: "14px 12px",
                  borderRadius: "6px",
                  letterSpacing: "-0.2px",
                  textDecoration: "none",
                  transition: "color .15s, background .15s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = "#cc001e";
                  e.currentTarget.style.backgroundColor = "#fff5f5";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = label === "STOKU" ? "#cc001e" : "#555";
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* ── Page body ──────────────────────────────────── */}
      <div className="max-w-[1280px] mx-auto px-5 py-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs mb-5" style={{ color: "#999" }}>
          <a href="/" style={{ color: "#999", textDecoration: "none" }}>Ballina</a>
          <span>›</span>
          <span style={{ color: "#333" }}>Stoku i Veturave</span>
          {brand && <><span>›</span><span style={{ color: "#333" }}>{brand}</span></>}
        </div>

        {/* Results header */}
        <div
          className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4"
          style={{ borderBottom: "1px solid #e9e9e9" }}
        >
          <div>
            <h1 className="text-base font-bold" style={{ color: "#181818" }}>
              Stoku i Veturave
              {brand && <span style={{ color: "#cc001e" }}> — {brand}</span>}
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "#888" }}>
              {filtered.length} vetura gjendur
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: "#888" }}>Rendit:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              style={selectStyle}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Active filter chips */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {activeFilters.map((f) => (
              <button
                key={f.key}
                onClick={() => removeFilter(f.key)}
                className="flex items-center gap-1.5 text-xs font-medium"
                style={{
                  border: "1px solid #cc001e",
                  color: "#cc001e",
                  borderRadius: "20px",
                  padding: "4px 12px",
                  backgroundColor: "#fff5f5",
                  cursor: "pointer",
                  transition: "background .15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#ffe0e4")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#fff5f5")}
              >
                {f.label} ✕
              </button>
            ))}
            <button
              onClick={() => router.push("/stock")}
              className="text-xs font-medium"
              style={{
                color: "#888",
                border: "1px solid #d9d9d9",
                borderRadius: "20px",
                padding: "4px 12px",
                backgroundColor: "#fff",
                cursor: "pointer",
              }}
            >
              Pastro të gjitha
            </button>
          </div>
        )}

        {/* Grid or empty state */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-4xl mb-4" style={{ color: "#ddd" }}>🔍</div>
            <p className="font-semibold mb-1" style={{ color: "#555" }}>Nuk u gjet asnjë veturë</p>
            <p className="text-sm mb-5" style={{ color: "#aaa" }}>Provoni të ndryshoni filtrat</p>
            <button
              onClick={() => router.push("/stock")}
              className="text-sm font-semibold text-white"
              style={{
                backgroundColor: "#cc001e",
                border: "none",
                borderRadius: "4px",
                padding: "10px 24px",
                cursor: "pointer",
              }}
            >
              Shiko të gjitha veturat
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </div>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer style={{ backgroundColor: "#1a1a1a", borderTop: "1px solid #222", padding: "20px 0", marginTop: "48px" }}>
        <div className="max-w-[1280px] mx-auto px-5 text-center text-xs" style={{ color: "#555" }}>
          © {new Date().getFullYear()} PremiumCars Korea. Të gjitha të drejtat e rezervuara.
        </div>
      </footer>

    </div>
  );
}

function CarCard({ car }: { car: Car }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link href={`/cars/${car.id}`} style={{ textDecoration: "none", display: "block" }}>
      <div
        style={{
          backgroundColor: "#fff",
          border: `1px solid ${hovered ? "#cc001e" : "#e9e9e9"}`,
          borderRadius: "6px",
          overflow: "hidden",
          transition: "border-color .15s, box-shadow .15s",
          boxShadow: hovered ? "0 4px 12px rgba(0,0,0,0.08)" : "none",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Thumbnail */}
        <div style={{ position: "relative", paddingTop: "66%", backgroundColor: "#f5f5f5", overflow: "hidden" }}>
          <img
            src={car.image}
            alt={car.title}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform .3s",
              transform: hovered ? "scale(1.03)" : "scale(1)",
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://placehold.co/400x270/f5f5f5/bbb?text=No+Image";
            }}
          />
          {car.report && !car.report.myCarAccident?.count && !car.report.totalLoss && (
            <span
              style={{
                position: "absolute",
                top: "8px",
                left: "8px",
                backgroundColor: "#00a651",
                color: "#fff",
                fontSize: "10px",
                fontWeight: 700,
                padding: "2px 6px",
                borderRadius: "3px",
                letterSpacing: "0.3px",
              }}
            >
              Pa Aksidente
            </span>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: "10px 12px 12px" }}>
          <h3
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#181818",
              lineHeight: 1.4,
              marginBottom: "6px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {car.title}
          </h3>
          <div style={{ fontSize: "11px", color: "#999", display: "flex", flexWrap: "wrap", gap: "4px 8px", marginBottom: "8px" }}>
            {car.year     && <span>{car.year}</span>}
            {car.mileage  && <span>{car.mileage}</span>}
            {car.fuel     && <span>{car.fuel}</span>}
          </div>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#cc001e" }}>
            {car.price > 0 ? `${toEur(car.price).toLocaleString("de-DE")} €` : "Me kërkesë"}
          </div>
        </div>
      </div>
    </Link>
  );
}
