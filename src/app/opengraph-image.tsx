import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt =
  "ZMK Display Studio — custom nice!view artwork, from image to firmware";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        padding: "52px 60px",
        background: "#f7f7f2",
        color: "#282b27",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 26 }}
      >
        <svg width="38" height="38" viewBox="0 0 38 38">
          <path
            fill="#282b27"
            d="M0 0h10v10H0zM14 0h10v10H14zM0 14h10v10H0zM28 14h10v10H28zM14 28h10v10H14zM28 28h10v10H28z"
          />
          <path
            fill="#9a4b13"
            d="M28 0h10v10H28zM14 14h10v10H14zM0 28h10v10H0z"
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
            <span style={{ color: "#9a4b13" }}>Your artwork.</span>
          </div>
          <div
            style={{
              marginTop: 26,
              fontSize: 25,
              lineHeight: 1.5,
              color: "#676b60",
            }}
          >
            Turn an image into custom ZMK display artwork. Preview every pixel.
            Export for your firmware.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              padding: 16,
              border: "2px solid #44483f",
              borderRadius: 14,
              background: "#282b27",
            }}
          >
            <svg width="400" height="170" viewBox="0 0 160 68">
              <rect width="160" height="68" fill="#dce3c3" />
              <path
                fill="#282b27"
                d="M0 60h8v-8h8v-8h8v-8h8v-8h8v8h8v8h8v8h8v8h8v8H0zM52 68V56h8V44h8V32h8V20h8V8h8v12h8v12h8v12h8v12h8v12z"
              />
              <path fill="#282b27" d="M16 10h12v12H16z" />
              <path
                stroke="#282b27"
                strokeWidth="1"
                d="M140 0v68M145 10h10v8h-10zM155 12h2v4h-2M145 55h10M145 59h6"
                fill="none"
              />
              <path fill="#282b27" d="M147 12h6v4h-6zM148 28h4v4h-4z" />
            </svg>
          </div>
          <span style={{ fontSize: 17, color: "#676b60", letterSpacing: 2 }}>
            140 × 68 PIXELS. MAKE THEM YOURS.
          </span>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: "1px solid #dddfd4",
          paddingTop: 24,
          fontSize: 19,
          color: "#676b60",
        }}
      >
        <span>Free · Browser-based · No image uploads</span>
        <span>{new URL(site.url).hostname}</span>
      </div>
    </div>,
    size,
  );
}
