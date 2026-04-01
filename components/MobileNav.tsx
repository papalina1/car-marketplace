"use client";

import { useState } from "react";

const NAV_LINKS = [
  { label: "BALLINA",             href: "/" },
  { label: "STOKU",               href: "/stock" },
  { label: "PROCEDURA E BLERJES", href: "/#procedura" },
  { label: "RRETH NESH",          href: "/#rreth" },
  { label: "KONTAKT",             href: "/#kontakt" },
];

export default function MobileNav({ activeLabel }: { activeLabel?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop nav */}
      <div className="hidden sm:block max-w-[1280px] mx-auto px-5">
        <nav className="flex items-center gap-1">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: 500,
                color: label === activeLabel ? "#cc001e" : "#555",
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

      {/* Mobile nav row */}
      <div className="sm:hidden" style={{ borderTop: "1px solid #f5f5f5" }}>
        <button
          onClick={() => setOpen(!open)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 20px",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: 600,
            color: "#333",
          }}
        >
          <span>Menu</span>
          <span style={{ fontSize: "18px" }}>{open ? "✕" : "☰"}</span>
        </button>

        {open && (
          <div style={{ borderTop: "1px solid #f5f5f5", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                style={{
                  display: "block",
                  padding: "14px 20px",
                  color: "#333",
                  textDecoration: "none",
                  borderBottom: "1px solid #f5f5f5",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                {label}
              </a>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
