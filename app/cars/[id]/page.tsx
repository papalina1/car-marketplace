import { getAllCars, getCarById } from "@/lib/cars";
import { toEur } from "@/lib/utils";
import { notFound } from "next/navigation";
import Link from "next/link";
import ImageGallery from "@/components/ImageGallery";

export async function generateStaticParams() {
  const cars = getAllCars();
  return cars.map((car) => ({ id: car.id }));
}

const NAV_LINKS = [
  { label: "BALLINA",             href: "/" },
  { label: "STOKU",               href: "/stock" },
  { label: "PROCEDURA E BLERJES", href: "/#procedura" },
  { label: "RRETH NESH",          href: "/#rreth" },
  { label: "KONTAKT",             href: "/#kontakt" },
];

export default async function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const car = getCarById(id);
  if (!car) return notFound();

  const specs = [
    { label: "Marka",                  value: car.brand    },
    { label: "Modeli",                 value: car.model    },
    { label: "Data e regjistrimit",    value: car.year     },
    { label: "Kilometrazha",           value: car.mileage  },
    { label: "Lëndë djegëse",          value: car.fuel     },
    { label: "Lokacioni (Kore)",       value: car.location },
  ];

  const waLink = "https://wa.me/38344552412?text=Po%20interesohem%20per%20kete%20veture:%20" + encodeURIComponent(car.title);
  const images = car.images && car.images.length > 0 ? car.images : [car.image];

  return (
    <div className="min-h-screen bg-white" style={{ color: "#333" }}>

      {/* ── Header ─────────────────────────────────────── */}
      <header className="bg-white sticky top-0 z-50" style={{ borderBottom: "1px solid #f3f3f3" }}>
        <div style={{ borderBottom: "1px solid #f5f5f5" }}>
          <div className="max-w-[1280px] mx-auto px-5 h-11 flex items-center justify-between">
            <a href="/" className="flex items-center gap-1" style={{ textDecoration: "none" }}>
              <span className="font-black text-xl tracking-tight" style={{ color: "#cc001e" }}>PREMIUM</span>
              <span className="font-black text-xl tracking-tight" style={{ color: "#181818" }}>CARS</span>
            </a>
            <a href="tel:+38344552412" className="text-xs font-semibold" style={{ color: "#cc001e", textDecoration: "none" }}>
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
                  color: "#555",
                  padding: "14px 12px",
                  borderRadius: "6px",
                  letterSpacing: "-0.2px",
                  textDecoration: "none",
                }}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <div className="max-w-[1280px] mx-auto px-5 py-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs mb-5" style={{ color: "#999" }}>
          <a href="/" style={{ color: "#999", textDecoration: "none" }}>Ballina</a>
          <span>›</span>
          <a href="/stock" style={{ color: "#999", textDecoration: "none" }}>Stoku</a>
          <span>›</span>
          <span style={{ color: "#333" }}>{car.brand} {car.model}</span>
        </div>

        {/* Title row */}
        <h1 className="text-xl font-bold mb-6" style={{ color: "#181818", letterSpacing: "-0.3px" }}>
          {car.title}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: gallery + specs */}
          <div className="lg:col-span-2 space-y-5">
            <ImageGallery images={images} />

            {/* Technical specs */}
            <div className="bg-white" style={{ border: "1px solid #e9e9e9", borderRadius: "6px" }}>
              <div style={{ padding: "14px 20px", borderBottom: "1px solid #e9e9e9" }}>
                <h2 className="font-bold text-sm" style={{ color: "#181818" }}>Të dhënat teknike</h2>
              </div>
              <div style={{ padding: "0 20px" }}>
                {specs.map(({ label, value }) => !value ? null : (
                  <div
                    key={label}
                    className="flex justify-between text-sm"
                    style={{ padding: "11px 0", borderBottom: "1px solid #f5f5f5" }}
                  >
                    <span style={{ color: "#888" }}>{label}</span>
                    <span style={{ color: "#181818", fontWeight: 600 }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Accident Report */}
            {car.report && (
              <div className="bg-white" style={{ border: "1px solid #e9e9e9", borderRadius: "6px" }}>
                <div className="flex items-center justify-between" style={{ padding: "14px 20px", borderBottom: "1px solid #e9e9e9" }}>
                  <h2 className="font-bold text-sm" style={{ color: "#181818" }}>Raporti i Aksidenteve</h2>
                  <a
                    href={car.report.reportUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs"
                    style={{ color: "#cc001e", textDecoration: "none" }}
                  >
                    Raporti i plotë →
                  </a>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-0" style={{ padding: "16px 20px", gap: "12px" }}>
                  <ReportCell
                    label="Dëmtim i veturës"
                    value={car.report.myCarAccident?.count
                      ? `${car.report.myCarAccident.count} herë`
                      : "Nuk ekziston"}
                    amount={car.report.myCarAccident?.amount ?? null}
                    ok={!car.report.myCarAccident?.count}
                  />
                  <ReportCell
                    label="Dëmtim i veturës tjetër"
                    value={car.report.otherCarAccident?.count
                      ? `${car.report.otherCarAccident.count} herë`
                      : "Nuk ekziston"}
                    amount={car.report.otherCarAccident?.amount ?? null}
                    ok={!car.report.otherCarAccident?.count}
                  />
                  {car.report.ownerChanges !== null && (
                    <ReportCell
                      label="Ndryshime pronari"
                      value={`${car.report.ownerChanges} herë`}
                      ok={car.report.ownerChanges === 0}
                    />
                  )}
                  <ReportCell
                    label="Dëmtim total / Përmbytje"
                    value={car.report.totalLoss || car.report.flood ? "Po" : "Jo"}
                    amount={(car.report.totalLoss && car.report.totalLossAmount)
                      ? car.report.totalLossAmount
                      : (car.report.flood && car.report.floodAmount)
                      ? car.report.floodAmount
                      : null}
                    ok={!car.report.totalLoss && !car.report.flood}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right: price + contact */}
          <div className="space-y-4">
            {/* Price card */}
            <div className="bg-white" style={{ border: "1px solid #e9e9e9", borderRadius: "6px", padding: "20px" }}>
              <div className="text-xs mb-1" style={{ color: "#888" }}>Çmimi</div>
              <div className="text-3xl font-black mb-1" style={{ color: "#cc001e" }}>
                {car.price > 0 ? `${toEur(car.price).toLocaleString("de-DE")} €` : "Me kërkesë"}
              </div>
              {car.price > 0 && (
                <div className="text-xs" style={{ color: "#aaa" }}>
                  Çmimi përfshin transport +1,200 € dhe taksa importi
                </div>
              )}

              <div className="mt-5 space-y-2">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full text-sm font-semibold text-white"
                  style={{
                    backgroundColor: "#cc001e",
                    borderRadius: "4px",
                    padding: "11px 16px",
                    textDecoration: "none",
                    transition: "background .15s",
                  }}
                >
                  Kontakto për veturën
                </a>
                <a
                  href={car.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full text-sm font-medium"
                  style={{
                    border: "1px solid #d9d9d9",
                    borderRadius: "4px",
                    padding: "10px 16px",
                    textDecoration: "none",
                    color: "#555",
                    transition: "border-color .15s",
                  }}
                >
                  Shiko në Encar.com ↗
                </a>
              </div>
            </div>

            {/* Contact card */}
            <div className="bg-white" style={{ border: "1px solid #e9e9e9", borderRadius: "6px", padding: "20px" }}>
              <h2 className="font-bold text-sm mb-4" style={{ color: "#181818" }}>Na Kontaktoni</h2>
              <div className="space-y-2">
                <a
                  href="tel:+38344552412"
                  className="flex items-center gap-3 text-sm"
                  style={{
                    padding: "10px 12px",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "4px",
                    textDecoration: "none",
                    color: "#333",
                    border: "1px solid #f0f0f0",
                  }}
                >
                  <span>📞</span>
                  <div>
                    <div className="font-semibold text-xs" style={{ color: "#181818" }}>+383 44 552 412</div>
                    <div className="text-xs" style={{ color: "#aaa" }}>Telefono tani</div>
                  </div>
                </a>
                <a
                  href="tel:+38349528990"
                  className="flex items-center gap-3 text-sm"
                  style={{
                    padding: "10px 12px",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "4px",
                    textDecoration: "none",
                    color: "#333",
                    border: "1px solid #f0f0f0",
                  }}
                >
                  <span>📞</span>
                  <div>
                    <div className="font-semibold text-xs" style={{ color: "#181818" }}>+383 49 528 990</div>
                    <div className="text-xs" style={{ color: "#aaa" }}>Telefono tani</div>
                  </div>
                </a>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm"
                  style={{
                    padding: "10px 12px",
                    backgroundColor: "#f0fff4",
                    borderRadius: "4px",
                    textDecoration: "none",
                    color: "#333",
                    border: "1px solid #d3f4e0",
                  }}
                >
                  <span>💬</span>
                  <div>
                    <div className="font-semibold text-xs" style={{ color: "#1a7a3a" }}>WhatsApp</div>
                    <div className="text-xs" style={{ color: "#aaa" }}>Na shkruani</div>
                  </div>
                </a>
                <div
                  className="flex items-center gap-3 text-sm"
                  style={{
                    padding: "10px 12px",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "4px",
                    border: "1px solid #f0f0f0",
                  }}
                >
                  <span>📍</span>
                  <div>
                    <div className="font-semibold text-xs" style={{ color: "#181818" }}>Fushë Kosovë</div>
                    <div className="text-xs" style={{ color: "#aaa" }}>Rr. Nënë Tereza</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Back link */}
            <Link
              href="/stock"
              className="text-sm"
              style={{ color: "#888", textDecoration: "none", display: "block", textAlign: "center" }}
            >
              ← Kthehu tek Stoku
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ backgroundColor: "#1a1a1a", borderTop: "1px solid #222", padding: "20px 0", marginTop: "48px" }}>
        <div className="max-w-[1280px] mx-auto px-5 text-center text-xs" style={{ color: "#555" }}>
          © {new Date().getFullYear()} PremiumCars Korea. Të gjitha të drejtat e rezervuara.
        </div>
      </footer>
    </div>
  );
}

function kwonToEur(amount: string): string {
  const digits = amount.replace(/[^\d]/g, "");
  if (!digits) return "";
  const eur = Math.round(parseInt(digits) / 1741.54);
  return eur.toLocaleString("de-DE") + " €";
}

function ReportCell({ label, value, amount, ok }: { label: string; value: string; amount?: string | null; ok: boolean }) {
  return (
    <div
      style={{
        backgroundColor: ok ? "#f0fff4" : "#fff5f5",
        border: `1px solid ${ok ? "#d3f4e0" : "#ffd6d6"}`,
        borderRadius: "4px",
        padding: "12px 14px",
      }}
    >
      <div className="text-xs mb-1.5" style={{ color: "#888" }}>{label}</div>
      <div className="text-sm font-bold" style={{ color: ok ? "#1a7a3a" : "#cc001e" }}>{value}</div>
      {amount && (
        <div className="text-xs mt-1" style={{ color: "#cc001e" }}>{kwonToEur(amount)}</div>
      )}
    </div>
  );
}
