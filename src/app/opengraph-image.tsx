import { ImageResponse } from "next/og";
import { site } from "@/lib/site";
import { niceView } from "@/lib/displays/nice-view";

export const alt =
  "ZMK Display Studio — custom nice!view artwork, from image to firmware";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  const { physical, artwork, statusArea } = niceView;
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        padding: "52px 60px",
        background: "#f7f8f4",
        color: "#1f2420",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 26 }}
      >
        <svg width="38" height="38" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="32" fill="#005326" />
          <path
            fill="#ffffff"
            d="M12 12h10v10H12zm15 0h10v10H27zM12 27h10v10H12zm30 0h10v10H42zM27 42h10v10H27zm15 0h10v10H42z"
          />
          <path
            fill="#e1e04a"
            d="M42 12h10v10H42zM27 27h10v10H27zM12 42h10v10H12z"
          />
        </svg>
        {site.name}
      </div>
      <div style={{ display: "flex", flex: 1, alignItems: "center", gap: 48 }}>
        <div style={{ display: "flex", flexDirection: "column", width: 590 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 66,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: -3,
            }}
          >
            <span>Your nice!view.</span>
            <span style={{ color: "#005326" }}>Your artwork.</span>
          </div>
          <div
            style={{
              marginTop: 26,
              fontSize: 25,
              lineHeight: 1.5,
              color: "#5f665f",
            }}
          >
            Turn an image into custom ZMK display artwork. Preview every pixel.
            Export for your firmware.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            position: "relative",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 64,
              right: -48,
              width: 240,
              height: 240,
              borderRadius: 120,
              background: "#e1e04a",
            }}
          />
          <div
            style={{
              display: "flex",
              position: "relative",
              padding: 16,
              border: "2px solid #1f2420",
              borderRadius: 20,
              background: "#3f3f3e",
            }}
          >
            <svg
              width={(320 * physical.width) / physical.height}
              height="320"
              viewBox={`0 0 ${physical.width} ${physical.height}`}
            >
              <rect
                width={physical.width}
                height={physical.height}
                fill="#ffffff"
              />
              <svg
                x={statusArea.physical.x}
                y={statusArea.physical.y}
                width={statusArea.physical.width}
                height={statusArea.physical.height}
                viewBox="0 0 100 30"
              >
                <path
                  stroke="#1f2420"
                  strokeWidth="2"
                  d="M8 8h24v13H8zM32 12h4v5h-4M78 5l12 10-12 10V5l12 20M90 5L78 15"
                  fill="none"
                />
                <path
                  fill="#1f2420"
                  d="M11 11h15v7H11zM44 10h6v10h-6zM56 10h6v10h-6z"
                />
              </svg>
              <path
                stroke="#1f2420"
                d={`M0 ${artwork.physical.y}h${physical.width}`}
              />
              <svg
                x={artwork.physical.x}
                y={artwork.physical.y}
                width={artwork.physical.width}
                height={artwork.physical.height}
                viewBox="0 0 100 200"
                preserveAspectRatio="none"
              >
                <circle cx="73" cy="35" r="12" fill="#3f3f3e" />
                <path fill="#1f2420" d="M0 130L40 65l35 65 25-25v95H0z" />
                <path fill="#ffffff" d="M40 65l12 35-12-10-10 13-5-14z" />
                <path fill="#d8ded0" d="M0 165l25-30 25 30 25-40 25 30v45H0z" />
                <path fill="#3f3f3e" d="M0 185l20-10 35 15 25-20 20 10v20H0z" />
              </svg>
            </svg>
          </div>
          <span style={{ fontSize: 17, color: "#5f665f", letterSpacing: 2 }}>
            {artwork.physical.width} × {artwork.physical.height} PHYSICAL
            ARTWORK
          </span>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: "1px solid #d8ded0",
          paddingTop: 24,
          fontSize: 19,
          color: "#5f665f",
        }}
      >
        <span>Free · Browser-based · No image uploads</span>
        <span>{new URL(site.url).hostname}</span>
      </div>
    </div>,
    size,
  );
}
