"use client";

import { useState } from "react";

interface Props {
  images: string[];
}

export default function ImageGallery({ images }: Props) {
  const [current, setCurrent]   = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div
        style={{
          borderRadius: "6px",
          overflow: "hidden",
          backgroundColor: "#f5f5f5",
          height: "480px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#bbb",
          border: "1px solid #e9e9e9",
        }}
      >
        Pa foto
      </div>
    );
  }

  function prev() { setCurrent((c) => (c === 0 ? images.length - 1 : c - 1)); }
  function next() { setCurrent((c) => (c === images.length - 1 ? 0 : c + 1)); }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft")  prev();
    if (e.key === "ArrowRight") next();
    if (e.key === "Escape")     setLightbox(false);
  }

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>

        {/* Main image */}
        <div
          style={{
            position: "relative",
            borderRadius: "6px",
            overflow: "hidden",
            backgroundColor: "#f5f5f5",
            height: "480px",
            cursor: "zoom-in",
            border: "1px solid #e9e9e9",
          }}
          onClick={() => setLightbox(true)}
        >
          <img
            src={images[current]}
            alt={"Foto " + (current + 1)}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://placehold.co/640x480/f5f5f5/bbb?text=No+Image";
            }}
          />

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  backgroundColor: "rgba(0,0,0,0.55)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50%",
                  width: "36px",
                  height: "36px",
                  fontSize: "18px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background .15s",
                }}
              >
                ‹
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  backgroundColor: "rgba(0,0,0,0.55)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50%",
                  width: "36px",
                  height: "36px",
                  fontSize: "18px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background .15s",
                }}
              >
                ›
              </button>
            </>
          )}

          {/* Counter badge */}
          <div
            style={{
              position: "absolute",
              bottom: "10px",
              right: "12px",
              backgroundColor: "rgba(0,0,0,0.6)",
              color: "#fff",
              fontSize: "11px",
              padding: "3px 8px",
              borderRadius: "20px",
            }}
          >
            {current + 1} / {images.length}
          </div>

          {/* Zoom hint */}
          <div
            style={{
              position: "absolute",
              bottom: "10px",
              left: "12px",
              backgroundColor: "rgba(0,0,0,0.5)",
              color: "#fff",
              fontSize: "11px",
              padding: "3px 8px",
              borderRadius: "20px",
            }}
          >
            🔍 Zmadho
          </div>
        </div>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "4px" }}>
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                style={{
                  flexShrink: 0,
                  width: "76px",
                  height: "54px",
                  borderRadius: "4px",
                  overflow: "hidden",
                  border: i === current ? "2px solid #cc001e" : "2px solid transparent",
                  opacity: i === current ? 1 : 0.55,
                  cursor: "pointer",
                  padding: 0,
                  backgroundColor: "transparent",
                  transition: "border-color .15s, opacity .15s",
                }}
              >
                <img
                  src={img}
                  alt={"thumb " + i}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://placehold.co/76x54/f5f5f5/bbb?text=X";
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            backgroundColor: "rgba(0,0,0,0.96)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setLightbox(false)}
          onKeyDown={handleKey}
          tabIndex={0}
        >
          {/* Close */}
          <button
            onClick={() => setLightbox(false)}
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              backgroundColor: "rgba(255,255,255,0.12)",
              color: "#fff",
              border: "none",
              borderRadius: "50%",
              width: "38px",
              height: "38px",
              fontSize: "18px",
              cursor: "pointer",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>

          {/* Counter */}
          <div
            style={{
              position: "absolute",
              top: "16px",
              left: "50%",
              transform: "translateX(-50%)",
              color: "#fff",
              fontSize: "13px",
              backgroundColor: "rgba(255,255,255,0.1)",
              padding: "4px 14px",
              borderRadius: "20px",
            }}
          >
            {current + 1} / {images.length}
          </div>

          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "rgba(255,255,255,0.12)",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                width: "44px",
                height: "44px",
                fontSize: "22px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ‹
            </button>
          )}

          <img
            src={images[current]}
            alt={"Foto " + (current + 1)}
            style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain" }}
            onClick={(e) => e.stopPropagation()}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://placehold.co/800x600/111/444?text=No+Image";
            }}
          />

          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              style={{
                position: "absolute",
                right: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "rgba(255,255,255,0.12)",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                width: "44px",
                height: "44px",
                fontSize: "22px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ›
            </button>
          )}

          {/* Thumbnails in lightbox */}
          <div
            style={{
              position: "absolute",
              bottom: "16px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "6px",
              overflowX: "auto",
              maxWidth: "80vw",
              padding: "0 8px",
            }}
          >
            {images.map((img, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                style={{
                  flexShrink: 0,
                  width: "68px",
                  height: "48px",
                  borderRadius: "4px",
                  overflow: "hidden",
                  border: i === current ? "2px solid #cc001e" : "2px solid transparent",
                  opacity: i === current ? 1 : 0.4,
                  cursor: "pointer",
                  padding: 0,
                  backgroundColor: "transparent",
                  transition: "opacity .15s",
                }}
              >
                <img src={img} alt={"t" + i} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
